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
  // TODO: Replace mocked content with real content when chat is up and there is media in a specific channel
  // const pendingContent = content.filter((media) => media.locked)
  // const purchasedContent = content.filter((media) => !media.locked)
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
        keyValue="messages"
      />
    </div>
  )
}
