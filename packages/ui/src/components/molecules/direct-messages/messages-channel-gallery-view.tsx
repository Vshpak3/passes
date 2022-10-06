import { GalleryMedia } from "src/components/messages/components/ChannelInner/GalleryMedia"

export type Content = {
  price: number
  locked: boolean
  date: string
  text: string
  imageUrl: string
}[]
const content = [
  {
    price: 32,
    locked: true,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 12,
    locked: false,
    date: "2 March",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 138,
    locked: true,
    date: "31 June",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 32,
    date: "14 July",
    locked: false,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 12,
    date: "2 March",
    locked: true,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 138,
    date: "31 June",
    locked: false,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "9 Oct",
    locked: true,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "10 Dec",
    locked: true,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 250,
    date: "14 July",
    locked: false,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "14 July",
    locked: true,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "14 July",
    locked: true,
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 250,
    locked: false,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  }
]

interface Props {
  activeContent: string
}

export const ChannelGalleryView = ({ activeContent }: Props) => {
  // const api = new MessagesApi()
  // const [_content, setContent] = useState([])

  // const getMessageStats = async () => {
  //   const contentMessages = await api.getMessages({
  //     getMessagesRequestDto: {
  //       sentAt: new Date(),
  //       dateLimit: new Date(),
  //       channelId: "testChannelId",
  //       contentOnly: true,
  //       pending: true
  //     }
  //   })
  //   setContent(contentMessages)
  // }

  // TODO: Replace mocked content with real content when chat is up and there is media in a specific channel
  const purchasedContent = content.filter((media) => !media.locked)
  const pendingContent = content.filter((media) => media.locked)

  return (
    <div className="flex h-full flex-wrap items-start justify-start gap-2 overflow-auto p-[10px]">
      {activeContent === "All" ? (
        <>
          {content.map((media, index) => (
            <GalleryMedia key={index} media={media} isCreator={true} />
          ))}
        </>
      ) : activeContent === "Purchased" ? (
        <>
          {purchasedContent.map((media, index) => (
            <GalleryMedia key={index} media={media} isCreator={true} />
          ))}
        </>
      ) : activeContent === "Not Purchased" ? (
        <>
          {pendingContent.map((media, index) => (
            <GalleryMedia key={index} media={media} isCreator={true} />
          ))}
        </>
      ) : null}
    </div>
  )
}
