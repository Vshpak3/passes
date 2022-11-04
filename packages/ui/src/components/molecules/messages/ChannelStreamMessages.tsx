import {
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC, memo, useEffect, useState } from "react"

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
  const [time, setTime] = useState<number>(Date.now())
  useEffect(() => {
    setTime(Date.now())
  }, [setTime, channelId])
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
      keyValue={`messages/${time}/${channelId}`} // add time to force reset, component doesn't remount since its memoized
      loadingElement={
        <div className="sticky top-0 z-50 left-0 w-full h-0.5">
          <div
            role="status"
            className="bg-passes-pink-100 animate-slide-in h-full w-24 rounded-full"
          />
          <span className="sr-only">Loading older messages...</span>
        </div>
      }
      options={{ revalidateOnMount: true }}
      scrollableTarget="scrollableDiv"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
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
    </InfiniteScrollPagination>
  )
}

export const ChannelStreamMessages = memo(ChannelStreamMessagesUnmemo)
