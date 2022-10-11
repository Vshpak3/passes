import { MessageDto, MessagesApi } from "@passes/api-client"
import { FC, Key, useEffect, useMemo, useState } from "react"
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
  activeContent: string
  selectedChannel: any
  isCreator: boolean
}

export const ChannelGalleryView: FC<Props> = ({
  activeContent,
  selectedChannel,
  isCreator
}) => {
  const api = useMemo(() => new MessagesApi(), [])
  const [paidGalleryContent, setPaidGalleryContent] = useState<any>([])
  const [unpaidGalleryContent, setUnpaidGalleryContent] = useState<any>([])

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const contentMessagesResponse = await api.getMessages({
        getMessagesRequestDto: {
          channelId: selectedChannel.channelId,
          contentOnly: true,
          pending: false
        }
      })
      if (contentMessagesResponse.data) {
        const paidContent = contentMessagesResponse.data.filter(
          (message) => message.paid
        )
        const unpaidContent = contentMessagesResponse.data.filter(
          (message) => !message.paid
        )
        setPaidGalleryContent(paidContent)
        setUnpaidGalleryContent(unpaidContent)
      }
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [api, selectedChannel.channelId])

  // TODO: Replace mocked content with real content when chat is up and there is media in a specific channel
  // const pendingContent = content.filter((media) => media.locked)
  // const purchasedContent = content.filter((media) => !media.locked)
  const allContent = [...paidGalleryContent, ...unpaidGalleryContent]
  return (
    <div className="flex h-full flex-wrap items-start justify-start gap-2 overflow-auto p-[10px]">
      {activeContent === "All" ? (
        <>
          {allContent.map(
            (message: MessageDto, index: Key | null | undefined) => (
              <GalleryMedia
                key={index}
                contents={message.contents}
                text={message.text}
                price={message.price}
                createdAt={message.sentAt}
                isCreator={isCreator}
                purchased={message.paid}
              />
            )
          )}
        </>
      ) : activeContent === "Purchased" ? (
        <>
          {paidGalleryContent.map(
            (message: MessageDto, index: Key | null | undefined) => (
              <GalleryMedia
                key={index}
                contents={message.contents}
                text={message.text}
                price={message.price}
                createdAt={message.sentAt}
                isCreator={isCreator}
                purchased={message.paid}
              />
            )
          )}
        </>
      ) : activeContent === "Not Purchased" ? (
        <>
          {unpaidGalleryContent.map(
            (message: MessageDto, index: Key | null | undefined) => (
              <GalleryMedia
                key={index}
                contents={message.contents}
                text={message.text}
                price={message.price}
                createdAt={message.sentAt}
                isCreator={isCreator}
                purchased={message.paid}
              />
            )
          )}
        </>
      ) : null}
    </div>
  )
}
