import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { PendingStatus } from "src/components/messages/assets/PendingStatus"
import { TippedMessage } from "src/components/molecules/direct-messages/completed-tipped-message"
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
  const socket = io(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/gateway`,
    {
      path: "/api/messages/gateway",
      transports: ["websocket"],
      auth: {
        Authorization: `Bearer ${accessToken}`
      },
      autoConnect: false
    }
  )
  const [isConnected, setIsConnected] = useState(socket.connected)
  // socket.connect()
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("message", "info")
    })
    socket.on("disconnect", () => {
      setIsConnected(false)
      setPendingMessages([])
    })
    socket.on("message", (data) => {
      const newMessage = data as MessageDto & { notification: string }
      if (newMessage.channelId === channelId) {
        switch (newMessage.notification) {
          case "message":
            setMessages([newMessage, ...messages])
            setPendingMessages(
              pendingMessages.filter(
                (message) => message.messageId !== newMessage.messageId
              )
            )
            break
          case "pending":
            setPendingMessages([newMessage, ...pendingMessages])
            break
          case "paying":
          case "failed_payment":
          case "paid":
            setMessages(
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
    socket.connect()
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("message")
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])
  const [pendingMessages, setPendingMessages] = useState<MessageDto[]>([])
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
                    <div
                      key={i}
                      className="m-4 flex max-w-[70%] flex-row-reverse self-end rounded"
                    >
                      <div className="mx-4 flex flex-col items-start">
                        <TippedMessage tipAmount={m?.tipAmount} />
                        <PendingStatus />
                      </div>
                    </div>
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
