// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import ArrowDownIcon from "public/icons/arrow-down.svg"
import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react"
import { toast } from "react-toastify"
import { io, Socket } from "socket.io-client"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { FreeMessagesLeftContainer } from "src/components/molecules/direct-messages/FreeMessagesLeftContainer"
import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { useOnScreen } from "src/hooks/useOnScreen"
import { useUser } from "src/hooks/useUser"
import { ChannelMessage } from "./ChannelMessage"

interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number | null
  minimumTip?: number | null
}

const api = new MessagesApi()

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  minimumTip
}) => {
  const { user } = useUser()

  const time = Date.now()

  const [bottomOfChatRef, isBottomOfChatVisible] = useOnScreen({
    threshold: 0.7
  })

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
    if (unreadCount > 0 && isBottomOfChatVisible) {
      setUnreadCount(0)
    }
    if (isBottomOfChatVisible) {
      onReadLastMessage()
    }
  }, [isBottomOfChatVisible, unreadCount, onReadLastMessage])

  return (
    <>
      {!!minimumTip && freeMessages !== undefined && (
        <div className="top-0 z-20 bg-transparent">
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
          <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
            KeyedComponent={({ arg }: ComponentArg<MessageDto>) => {
              return (
                <ChannelMessage
                  message={{
                    ...arg,
                    ...(messageUpdates[arg.messageId] ?? {})
                  }}
                  ownsMessage={arg.senderId === user?.userId}
                />
              )
            }}
            fetch={async (req: GetMessagesRequestDto) => {
              return await api.getMessages({ getMessagesRequestDto: req })
            }}
            fetchProps={{ channelId, pending: false, contentOnly: false }}
            inverse
            keyValue={`messages/${time}/${channelId}`}
            loadingElement={<div>Loading older messages...</div>}
            scrollableTarget="scrollableDiv"
            style={{ display: "flex", flexDirection: "column-reverse" }}
          >
            {messages.length > 0 &&
              messages.map((m, i) => {
                return (
                  <ChannelMessage
                    key={i}
                    message={{
                      ...m,
                      ...(messageUpdates[m.messageId] ?? {})
                    }}
                    ownsMessage={m.senderId === user?.userId}
                  />
                )
              })}
            {pendingMessages.length > 0 &&
              pendingMessages.map((m, i) => {
                return (
                  <ChannelMessage
                    key={i}
                    message={{
                      ...m,
                      ...(messageUpdates[m.messageId] ?? {})
                    }}
                    ownsMessage={m.senderId === user?.userId}
                  />
                )
              })}
          </InfiniteScrollPagination>
          {unreadCount > 0 && (
            <button
              className="fixed mb-5
            flex items-center self-center rounded border border-[#3A444C]/30 bg-[#B52A6F]/25 py-2.5 px-6"
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
