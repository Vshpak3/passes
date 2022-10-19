import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { FreeMessagesLeftContainer } from "src/components/molecules/direct-messages/free-messages-left-container"
import { useUser } from "src/hooks/useUser"

import { ChannelMessage } from "./ChannelMessage"

const api = new MessagesApi()
export interface ChannelStreamProps {
  channelId?: string
  freeMessages?: number | null
  isCreator?: boolean
  contentAvatarDisplayName?: string
  contentAvatarUserName?: string
  minimumTip?: number | null
}

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  contentAvatarDisplayName,
  contentAvatarUserName,
  minimumTip
}) => {
  const { user } = useUser()
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<MessageDto[]>([])

  const { accessToken } = useUser()
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket>()

  const [pendingMessages, setPendingMessages] = useState<MessageDto[]>([])
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
            case "paying":
            case "failed_payment":
            case "paid":
              setMessages((messages) =>
                messages.map((message) => {
                  return message.messageId === newMessage.messageId
                    ? newMessage
                    : message
                })
              )
              break
          }
        }
      })
      return () => {
        socket.off("message")
      }
    }
  }, [channelId, socket])
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
      {isConnected && (
        <>
          <div
            id="scrollableDiv"
            className="flex h-full flex-1 flex-col overflow-y-scroll"
            // onScroll={handleScroll}
            // ref={bottomOfChatRef}
            onFocus={onReadLastMessage}
            style={{
              // height: 300,
              // overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse"
            }}
          >
            <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
              keyValue="messages"
              fetch={async (req: GetMessagesRequestDto) => {
                return await api.getMessages({ getMessagesRequestDto: req })
              }}
              fetchProps={{ channelId, pending: false, contentOnly: false }}
              KeyedComponent={({ arg }: ComponentArg<MessageDto>) => {
                return (
                  <ChannelMessage
                    message={arg}
                    isOwnMessage={arg.senderId === user?.userId}
                    contentAvatarDisplayName={contentAvatarDisplayName}
                    contentAvatarUserName={contentAvatarUserName}
                  />
                )
              }}
              scrollableTarget="scrollableDiv"
              loadingElement={<div>Loading older messages...</div>}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              inverse={true}
            >
              {pendingMessages.length > 0 &&
                pendingMessages.map((m, i) => {
                  return (
                    <ChannelMessage
                      key={i}
                      message={m}
                      isOwnMessage={m.senderId === user?.userId}
                      contentAvatarDisplayName={contentAvatarDisplayName}
                      contentAvatarUserName={contentAvatarUserName}
                    />
                  )
                })}
              {messages.length > 0 &&
                messages.map((m, i) => {
                  return (
                    <ChannelMessage
                      key={i}
                      message={m}
                      isOwnMessage={m.senderId === user?.userId}
                      contentAvatarDisplayName={contentAvatarDisplayName}
                      contentAvatarUserName={contentAvatarUserName}
                    />
                  )
                })}
            </InfiniteScrollPagination>

            {/* Dummy ref to allow scrolling to bottom of chat */}
            <div ref={bottomOfChatRef} />
          </div>
        </>
      )}
    </>
  )
}
