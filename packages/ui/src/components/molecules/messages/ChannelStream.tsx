import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, useEffect, useRef, useState } from "react"
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
}

export const ChannelStream: FC<ChannelStreamProps> = ({
  channelId,
  freeMessages,
  contentAvatarDisplayName,
  contentAvatarUserName
}) => {
  const { user } = useUser()
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
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
      {freeMessages !== undefined && (
        <div className="sticky top-0 z-20 w-full">
          <FreeMessagesLeftContainer freeMessages={freeMessages} />
        </div>
      )}

      <div
        className="flex h-full flex-1 flex-col overflow-y-scroll"
        // onScroll={handleScroll}
        // ref={bottomOfChatRef}
        onFocus={onReadLastMessage}
        style={{
          height: 300,
          overflow: "auto",
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
          loadingElement={<div>Loading older messages...</div>}
        />
        {/* {messages.length ? (
        <>
          {channelId &&
            messages.map((message, index) => (
              <ChannelMessage
                key={index}
                message={message}
                isOwnMessage={message.senderId === user?.userId}
                lastMessage={index === 0}
                channelId={channelId}
                contentAvatarDisplayName={contentAvatarDisplayName}
                contentAvatarUserName={contentAvatarUserName}
              />
            ))}
          <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
            keyValue="messages"
            fetch={async (req: GetMessagesRequestDto) => {
              const api = new MessagesApi()
              return await api.getMessages({ getMessagesRequestDto: req })
            }}
            fetchProps={{ channelId, pending: false }}
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
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          No messages
        </div>
      )} */}
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

        {/* Dummy ref to allow scrolling to bottom of chat */}
        <div ref={bottomOfChatRef} />
      </div>
    </>
  )
}
