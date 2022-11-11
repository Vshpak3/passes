import {
  ChannelMemberDto,
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { memo, PropsWithChildren, useEffect, useMemo } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { useUser } from "src/hooks/useUser"
import { ChannelMessage } from "./ChannelMessage"

interface ChannelStreamMessagesProps {
  channelId?: string
  messageUpdates: Record<string, Partial<MessageDto>>
  node?: HTMLDivElement
  readAt?: Date
  selectedChannel: ChannelMemberDto
}

const api = new MessagesApi()
const ChannelStreamMessagesUnmemo = ({
  channelId,
  messageUpdates,
  node,
  readAt = new Date(),
  selectedChannel,
  children
}: PropsWithChildren<ChannelStreamMessagesProps>) => {
  const { user } = useUser()
  const fetchProps = useMemo(() => {
    return { channelId, pending: false, contentOnly: false }
  }, [channelId])

  return (
    <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
      KeyedComponent={({ arg, nextArg }: ComponentArg<MessageDto>) => {
        return (
          <ChannelMessage
            message={arg}
            messageUpdate={messageUpdates[arg.messageId]}
            ownsMessage={arg.senderId === user?.userId}
            selectedChannel={selectedChannel}
            showReadAt={
              arg.sentAt > readAt && (nextArg?.sentAt ?? new Date()) < readAt
            }
          />
        )
      }}
      childrenEnd
      fetch={async (req: GetMessagesRequestDto) => {
        return await api.getMessages({ getMessagesRequestDto: req })
      }}
      fetchProps={fetchProps}
      inverse
      keySelector="messageId"
      keyValue={`messages/${channelId}`}
      loadingElement={
        <div className="sticky top-[0px] left-0 z-50 h-0.5 w-full">
          <div
            className="top-[-30px] h-full w-24 animate-slide-in rounded-full bg-passes-pink-100"
            role="status"
          />
          <span className="sr-only">Loading older messages...</span>
        </div>
      }
      node={node}
      scrollableTarget="messagesDiv"
      style={{ display: "flex", flexDirection: "column-reverse" }}
    >
      {children}
    </InfiniteScrollPagination>
  )
}

export const ChannelStreamMessages = memo(ChannelStreamMessagesUnmemo)
