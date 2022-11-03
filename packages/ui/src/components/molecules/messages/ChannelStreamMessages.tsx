import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, memo } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { useUser } from "src/hooks/useUser"
import { ChannelMessage } from "./ChannelMessage"

interface ChannelStreamMessagesProps {
  channelId?: string
  messageUpdates: Record<string, Partial<MessageDto>>
  messages: MessageDto[]
  pendingMessages: MessageDto[]
}

const api = new MessagesApi()

const ChannelStreamMessagesUnmemo: FC<ChannelStreamMessagesProps> = ({
  channelId,
  messageUpdates,
  messages,
  pendingMessages
}) => {
  const { user } = useUser()
  return (
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
      keyValue={`messages/${channelId}`}
      loadingElement={<div>Loading older messages...</div>}
      options={{ revalidateOnMount: true }}
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
  )
}

export const ChannelStreamMessages = memo(ChannelStreamMessagesUnmemo)
