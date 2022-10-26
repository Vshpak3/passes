import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  GetUserResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, useEffect, useRef, useState } from "react"
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
import { useUser } from "src/hooks/useUser"
import { ChannelMessage } from "./ChannelMessage"

interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number | null
  isCreator?: boolean
  minimumTip?: number | null
  otherUserDisplayName: string | undefined
  otherUserUsername: string
  user: GetUserResponseDto
}

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  minimumTip,
  otherUserDisplayName,
  otherUserUsername,
  user
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, _setTime] = useState(Date.now())
  const api = new MessagesApi()

  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<MessageDto[]>([])

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
        const newMessage = data as MessageDto & { notification: string }
        if (newMessage.channelId === channelId) {
          switch (newMessage.notification) {
            case "message":
              setMessages((messages) => [newMessage, ...messages])
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
              setMessages((messages) =>
                messages.map((message) => {
                  return message.messageId === newMessage.messageId
                    ? newMessage
                    : message
                })
              )
              break
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
  }, [channelId, socket, setMessageUpdates])
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  const onReadLastMessage = async () => {
    if (channelId) {
      await api.readMessages({
        channelId
      })
    }
  }

  return (
    <>
      {!!minimumTip && freeMessages !== undefined && (
        <div className="sticky top-0 z-20 w-full">
          <FreeMessagesLeftContainer freeMessages={freeMessages} />
        </div>
      )}
      {isConnected ? (
        <>
          <div
            id="scrollableDiv"
            className="flex h-full flex-1 flex-col overflow-y-scroll"
            onFocus={onReadLastMessage}
            style={{
              display: "flex",
              flexDirection: "column-reverse"
            }}
          >
            <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
              keyValue={`messages/${time}`}
              fetch={async (req: GetMessagesRequestDto) => {
                return await api.getMessages({ getMessagesRequestDto: req })
              }}
              fetchProps={{ channelId, pending: false, contentOnly: false }}
              KeyedComponent={({ arg }: ComponentArg<MessageDto>) => {
                return (
                  <ChannelMessage
                    message={{
                      ...arg,
                      ...(messageUpdates[arg.messageId] ?? {})
                    }}
                    isOwnMessage={arg.senderId === user?.userId}
                    otherUserDisplayName={otherUserDisplayName}
                    otherUserUsername={otherUserUsername}
                    user={user}
                  />
                )
              }}
              scrollableTarget="scrollableDiv"
              loadingElement={<div>Loading older messages...</div>}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              inverse={true}
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
                      isOwnMessage={m.senderId === user?.userId}
                      otherUserDisplayName={otherUserDisplayName}
                      otherUserUsername={otherUserUsername}
                      user={user}
                    />
                  )
                })}
              {pendingMessages.length > 0 &&
                pendingMessages.map((m, i) => {
                  return (
                    <ChannelMessage
                      key={i}
                      message={m}
                      isOwnMessage={m.senderId === user?.userId}
                      otherUserDisplayName={otherUserDisplayName}
                      otherUserUsername={otherUserUsername}
                      user={user}
                    />
                  )
                })}
            </InfiniteScrollPagination>

            {/* Dummy ref to allow scrolling to bottom of chat */}
            <div ref={bottomOfChatRef} />
          </div>
        </>
      ) : (
        <div className="flex-1" />
      )}
    </>
  )
}
