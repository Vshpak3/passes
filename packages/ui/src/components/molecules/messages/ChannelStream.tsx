import { MessageDto, MessagesApi } from "@passes/api-client"
import ArrowDownIcon from "public/icons/arrow-down.svg"
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
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
import { ChannelStreamMessages } from "./ChannelStreamMessages"

interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number | null
  minimumTip?: number | null
  setAdditionalTips: Dispatch<SetStateAction<number>>
  bottomOfChatRef: MutableRefObject<HTMLDivElement | null>
  isBottomOfChatVisible: boolean
}

const api = new MessagesApi()

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  minimumTip,
  setAdditionalTips,
  bottomOfChatRef,
  isBottomOfChatVisible
}) => {
  const { user } = useUser()

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
              if (newMessage.senderId !== user?.userId) {
                setAdditionalTips((tips) => tips + (newMessage.tipAmount ?? 0))
              }
              break
            case "pending":
              setPendingMessages((pendingMessages) => [
                newMessage,
                ...pendingMessages
              ])
              break
            case "failed_payment":
              toast.error("Payment for post failed")
            // falls through
            case "paying":
            case "paid":
            case "processed":
              setMessageUpdates((messageUpdates) => {
                return { ...messageUpdates, [newMessage.messageId]: newMessage }
              })
              break
          }
        }
      })
      return () => {
        socket.off("message")
      }
    }
  }, [channelId, socket, setMessageUpdates, setAdditionalTips, user?.userId])

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

  return (
    <>
      {!!minimumTip && freeMessages !== undefined && (
        <div className="absolute top-24 z-20 w-full bg-transparent pr-4">
          <FreeMessagesLeftContainer freeMessages={freeMessages} />
        </div>
      )}
      {isConnected ? (
        <div
          className="relative flex h-full flex-1 flex-col-reverse overflow-y-scroll"
          id="scrollableDiv"
          onFocus={onReadLastMessage}
        >
          {/*
             Dummy ref to allow scrolling to bottom of chat.
             Note it has to go at the top because of 'flex-col-reverse'
          */}
          <div className="h-1 w-1" id="bottom-of-chat" ref={bottomOfChatRef} />
          <ChannelStreamMessages
            channelId={channelId}
            messageUpdates={messageUpdates}
            messages={messages}
            pendingMessages={pendingMessages}
          />
          {unreadCount > 0 && (
            <button
              className="fixed z-20
            mb-5 flex items-center self-center rounded border border-[#3A444C]/30 bg-[#B52A6F]/25 py-2.5 px-6"
              onClick={handleScrollToBottom}
            >
              <ArrowDownIcon />
              <span className="ml-2">
                +{unreadCount} New Message
                {unreadCount !== 1 && "s"}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </>
  )
}
