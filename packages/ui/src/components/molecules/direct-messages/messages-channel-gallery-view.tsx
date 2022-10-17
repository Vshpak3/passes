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

export type Content = {
  price: number
  locked: boolean
  date: string
  text: string
  imageUrl: string
}[]
// const content = [
//   {
//     price: 32,
//     locked: true,
//     date: "14 July",
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 12,
//     locked: false,
//     date: "2 March",
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 138,
//     locked: true,
//     date: "31 June",
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 32,
//     date: "14 July",
//     locked: false,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 12,
//     date: "2 March",
//     locked: true,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 138,
//     date: "31 June",
//     locked: false,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 500,
//     date: "9 Oct",
//     locked: true,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 500,
//     date: "10 Dec",
//     locked: true,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 250,
//     date: "14 July",
//     locked: false,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 500,
//     date: "14 July",
//     locked: true,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 500,
//     date: "14 July",
//     locked: true,
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   },
//   {
//     price: 250,
//     locked: false,
//     date: "14 July",
//     text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
//     imageUrl: ""
//   }
// ]

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
              purchased={arg.paid}
            />
          )
        }}
      />
    </div>
  )
}
