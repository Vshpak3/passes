import {
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
import { GalleryMedia } from "src/components/messages/components/ChannelInner/GalleryMedia"

interface Props {
  paid?: boolean
  selectedChannel: any
  isCreator: boolean
}

export const ChannelGalleryView: FC<Props> = ({
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
        keyValue="messages"
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
        KeyedComponent={({ arg }: ComponentArg<MessageDto>) => {
          return (
            <GalleryMedia
              contents={arg.contents}
              text={arg.text}
              price={arg.price}
              createdAt={arg.sentAt}
              isCreator={isCreator}
              purchased={!!arg.paidAt}
            />
          )
        }}
      />
    </div>
  )
}
