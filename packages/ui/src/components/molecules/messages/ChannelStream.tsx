import { ChannelMemberDto, MessageDto, MessagesApi } from "@passes/api-client"
import ArrowDownIcon from "public/icons/arrow-down.svg"
import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react"
import { toast } from "react-toastify"
import { io, Socket } from "socket.io-client"

import { FreeMessagesLeftContainer } from "src/components/molecules/direct-messages/FreeMessagesLeftContainer"
import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { useUser } from "src/hooks/useUser"
import { ChannelMessage } from "./ChannelMessage"
import { ChannelStreamMessages } from "./ChannelStreamMessages"

interface ChannelStreamProps {
  selectedChannel: ChannelMemberDto
  freeMessages?: number | null
  minimumTip?: number | null
  bottomOfChatRef: MutableRefObject<HTMLDivElement | null>
  isBottomOfChatVisible: boolean
  readAt?: Date
}

const api = new MessagesApi()

export const ChannelStream: FC<ChannelStreamProps> = ({
  selectedChannel,
  freeMessages,
  minimumTip,
  bottomOfChatRef,
  isBottomOfChatVisible,
  readAt
}) => {
  const { user } = useUser()
  const { channelId } = selectedChannel

  const [messages, setMessages] = useState<MessageDto[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { accessToken } = useUser()
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket>()

  const [pendingMessages, setPendingMessages] = useState<MessageDto[]>([])
  const [messageUpdates, setMessageUpdates] = useState<
    Record<string, Partial<MessageDto>>
  >({})
  const [attempts, setAttempts] = useState<number>(0)
  useEffect(() => {
    setSocket(
      accessToken && accessToken.length
        ? io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/gateway`, {
            path: "/api/messages/gateway",
            transports: ["websocket"],
            auth: {
              Authorization: `Bearer ${accessToken}`
            },
            autoConnect: false
          })
        : undefined
    )
  }, [accessToken])

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true)
        setAttempts(0)
      })
      socket.on("disconnect", () => {
        setIsConnected(false)
        setPendingMessages([])
      })
      socket.connect()
      return () => {
        socket.off("connect")
        socket.off("disconnect")
        socket.disconnect()
      }
    }
  }, [socket])

  useEffect(() => {
    if (!isConnected && attempts < MAX_RECONNECT_ATTEMPTS) {
      const interval = setTimeout(async () => {
        socket?.connect()
        setAttempts(attempts + 1)
      }, TIME_BETWEEN_RECONNECTS)
      return () => clearInterval(interval)
    }
  }, [isConnected, attempts, socket])

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        data.sentAt = new Date(data.sentAt)
        if (data.paidAt) {
          data.paidAt = new Date(data.paidAt)
        }
        const newMessage = data as MessageDto & { notification: string }
        if (newMessage.channelId === channelId) {
          switch (newMessage.notification) {
            case "message":
              setMessages((messages) => [newMessage, ...messages])
              setUnreadCount((count) =>
                newMessage.senderId !== user?.userId ? count + 1 : count
              )
              setPendingMessages((pendingMessages) =>
                pendingMessages.filter(
                  (message) => message.messageId !== newMessage.messageId
                )
              )
              break
            case "pending":
              setPendingMessages((pendingMessages) => [
                newMessage,
                ...pendingMessages
              ])
              break
            case "failed_payment":
              if (!toast.isActive) {
                toast.error("Payment for message failed")
              }
            // falls through
            case "paying":
            case "paid":
            case "processed":
              setMessageUpdates((messageUpdates) => {
                return { ...messageUpdates, [newMessage.messageId]: newMessage }
              })
              break
            case "deleted":
              // regular message deletions don't update

              // setMessages((messages) =>
              //   messages.filter(
              //     (message) => message.messageId !== newMessage.messageId
              //   )
              // )
              setPendingMessages((pendingMessages) =>
                pendingMessages.filter(
                  (message) => message.messageId !== newMessage.messageId
                )
              )
              break
          }
        }
      })
      return () => {
        socket.off("message")
      }
    }
  }, [channelId, socket, setMessageUpdates, user?.userId])

  useEffect(() => {
    if (!channelId) {
      return
    }
    const fetch = async () => {
      // This always returns all pending messages
      const pendingMessagesRes = await api.getMessages({
        getMessagesRequestDto: {
          channelId,
          contentOnly: false,
          pending: true
        }
      })
      setPendingMessages(pendingMessagesRes.data)
    }
    fetch()
  }, [channelId])

  const onReadLastMessage = useCallback(async () => {
    if (channelId) {
      await api.readMessages({
        channelId
      })
    }
  }, [channelId])

  const handleScrollToBottom = useCallback(() => {
    bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" })
    setUnreadCount(0)
  }, [bottomOfChatRef])

  useLayoutEffect(() => {
    // if you scroll to the bottom, get rid of unread message IDs
    if (isBottomOfChatVisible) {
      onReadLastMessage()
      setUnreadCount(0)
    }
  }, [isBottomOfChatVisible, unreadCount, onReadLastMessage])

  const [node, setNode] = useState<HTMLDivElement>()
  const ref = useCallback((node: HTMLDivElement) => {
    setNode(node)
  }, [])

  return (
    <>
      {isConnected ? (
        <div className="relative h-full overflow-y-hidden">
          {!!minimumTip && freeMessages !== undefined && (
            <div className="absolute z-20 flex w-full justify-center bg-transparent pr-4">
              <FreeMessagesLeftContainer freeMessages={freeMessages} />
            </div>
          )}
          <div
            className="relative flex h-full flex-col-reverse overflow-y-scroll"
            id="messagesDiv"
            ref={ref}
          >
            {/*
             Dummy ref to allow scrolling to bottom of chat.
             Note it has to go at the top because of 'flex-col-reverse'
          */}
            <div
              className="h-1 w-1"
              id="bottom-of-chat"
              ref={bottomOfChatRef}
            />
            {pendingMessages.map((m) => {
              return (
                <ChannelMessage
                  key={m.messageId}
                  message={m}
                  messageUpdate={messageUpdates[m.messageId]}
                  ownsMessage={m.senderId === user?.userId}
                  selectedChannel={selectedChannel}
                />
              )
            })}
            {messages.map((m) => {
              return (
                <ChannelMessage
                  key={m.messageId}
                  message={m}
                  messageUpdate={messageUpdates[m.messageId]}
                  ownsMessage={m.senderId === user?.userId}
                  selectedChannel={selectedChannel}
                />
              )
            })}
            <ChannelStreamMessages
              channelId={channelId}
              messageUpdates={messageUpdates}
              node={node}
              readAt={readAt}
              selectedChannel={selectedChannel}
            />
          </div>
          {unreadCount > 0 && (
            <div className="absolute bottom-0 z-20 flex w-full items-center justify-center self-center">
              <button
                className="z-20 flex items-center justify-center self-center rounded border border-[#3A444C]/30 bg-[#B52A6F]/25 py-2.5 px-6"
                onClick={handleScrollToBottom}
              >
                <ArrowDownIcon />
                <span className="ml-2">
                  +{unreadCount} New Message
                  {unreadCount !== 1 && "s"}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </>
  )
}
