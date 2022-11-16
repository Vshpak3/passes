import {
  ChannelMemberDto,
  GetMessagesRequestDto,
  GetMessagesResponseDto,
  MessageDto,
  MessagesApi
} from "@passes/api-client"
import { FC } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { GalleryMedia } from "src/components/molecules/messages/GalleryMedia"

interface ChannelGalleryViewProps {
  paid?: boolean
  selectedChannel: ChannelMemberDto
  isCreator: boolean
}

export const ChannelGalleryView: FC<ChannelGalleryViewProps> = ({
  paid,
  selectedChannel,
  isCreator
}) => {
  return (
    <div className="flex h-full flex-wrap items-start justify-start gap-2 overflow-auto p-[10px]">
      <InfiniteScrollPagination<MessageDto, GetMessagesResponseDto>
        KeyedComponent={({ arg }: ComponentArg<MessageDto>) => {
          return (
            <GalleryMedia
              contents={arg.contents}
              createdAt={arg.sentAt}
              isCreator={isCreator}
              price={arg.price}
              purchased={!!arg.paidAt}
              text={arg.text}
            />
          )
        }}
        fetch={async (req: GetMessagesRequestDto) => {
          const api = new MessagesApi()
          return await api.getMessages({ getMessagesRequestDto: req })
        }}
        fetchProps={{
          channelId: selectedChannel.channelId,
          pending: false,
          contentOnly: true,
          paid
        }}
        keySelector="messageId"
        keyValue="/pages/messages"
      />
    </div>
  )
}
