import { MessagesApi } from "@passes/api-client/apis"
import ImageIcon from "public/icons/messages-image-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import React, { useContext, useState } from "react"
import { toast } from "react-toastify"
import { PostUnlockButton } from "src/components/atoms"
import BuyPostModal from "src/components/organisms/BuyPostModal"
import { classNames, ContentService, formatCurrency } from "src/helpers"
import { wrapApi } from "src/helpers/wrapApi"
import { useChat } from "src/hooks"
import { logChatPromiseExecution } from "stream-chat"
import {
  ChatContext,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window
} from "stream-chat-react"

import {
  MessagingChannelHeader,
  MessagingInput,
  MessagingInputFanPerspective
} from "../../components"
import { GiphyContext } from "../../index"

const pendingContent = [
  {
    price: 32,
    locked: true,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 12,
    locked: true,
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
  }
]

const paidContent = [
  {
    price: 32,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 12,
    date: "2 March",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 138,
    date: "31 June",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "9 Oct",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "10 Dec",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 250,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 500,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  },
  {
    price: 250,
    date: "14 July",
    text: "Lorem ispum ispum lorem Lorem ispum ispum lorem Lorem ispum ispum lorem",
    imageUrl: ""
  }
]

export const ChannelInner = (props) => {
  const { theme, toggleMobile } = props
  let sumPaid = paidContent.reduce(function (prev, current) {
    return prev + +current.price
  }, 0)
  let sumPending = pendingContent.reduce(function (prev, current) {
    return prev + +current.price
  }, 0)
  const {
    giphyState,
    setGiphyState,
    files,
    setFiles,
    isCreator,
    gallery,
    purchasedContent
  } = useContext(GiphyContext)
  const { channel: activeChannel, client } = useChatContext(ChatContext)

  const members = Object.values(activeChannel?.state?.members).filter(
    ({ user }) => user?.id !== client.userID
  )

  const { channelId } = useChat(members[0]?.user.name)
  const sendMessage = async (messageToSend) => {
    const content = await new ContentService().uploadContent(files)
    try {
      const api = wrapApi(MessagesApi)
      await api.sendMessage({
        sendMessageRequestDto: {
          text: messageToSend.text || "",
          attachments: [],
          content: content.map((c) => c.id),
          channelId
        }
      })
      setFiles([])
    } catch (err) {
      toast.error(err)
      console.error(err)
    }
  }

  const overrideSubmitHandler = (message) => {
    let updatedMessage

    if (message.attachments?.length && message.text?.startsWith("/giphy")) {
      const updatedText = message.text.replace("/giphy", "")
      updatedMessage = { ...message, text: updatedText }
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`
      updatedMessage = { ...message, text: updatedText }
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message
      const parentMessage = newMessage.parent

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString()
            }
          : undefined
      }

      const sendMessagePromise = sendMessage(messageToSend)
      logChatPromiseExecution(sendMessagePromise, "send message")
    }

    setGiphyState(false)
  }

  const actions = ["delete", "edit", "flag", "mute", "react", "reply"]

  return (
    <>
      <Window>
        <MessagingChannelHeader
          theme={theme}
          toggleMobile={toggleMobile}
          isCreator={isCreator}
        />
        {isCreator && (
          <div
            className={classNames(
              gallery
                ? "custom-border-second-header-gallery"
                : "custom-border-second-header",
              " spending-tips-buttons flex min-h-[54px] items-center justify-start gap-[18px] bg-[#1b141d]/50 pl-5 "
            )}
          >
            {gallery ? (
              <span>
                {purchasedContent ? "Earnings:" : " Pending Payments:"}
              </span>
            ) : (
              <span>Tips spent</span>
            )}
            {gallery ? (
              <div className="flex h-full items-center justify-center">
                <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-passes-secondary-color">
                  {purchasedContent
                    ? formatCurrency(sumPaid)
                    : formatCurrency(sumPending)}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-start gap-[10px]">
                <div className="m-0 flex cursor-pointer items-center p-0">
                  <span className="flex h-[36px] w-[87px] items-center justify-center rounded-l-[40px] bg-[#E58230] text-[16px] font-medium leading-[16px] text-[#ffff]">
                    Today 👑
                  </span>
                  <span className="flex h-[36px] w-[60px] items-center justify-center rounded-r-[40px] bg-[#D55C26] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                    $200
                  </span>
                </div>
                <div className="m-0 flex cursor-pointer items-center p-0">
                  <span className="flex h-[36px] w-[125px] items-center justify-center rounded-l-[40px] bg-[#499B8E] text-[16px] font-medium leading-[16px] text-[#ffff]">
                    4 days ago 👏🏻
                  </span>
                  <span className="flex h-[36px] w-[58px] items-center justify-center rounded-r-[40px] bg-[#3B867A] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                    $150
                  </span>
                </div>
                <div className="m-0 flex cursor-pointer items-center p-0">
                  <span className="flex h-[36px] w-[89px] items-center justify-center rounded-l-[40px] bg-[#589752] text-[16px] font-medium leading-[16px] text-[#ffff]">
                    March 👍
                  </span>
                  <span className="flex h-[36px] w-[40px] items-center justify-center rounded-r-[40px] bg-[#488243] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                    $5
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        {!gallery && <MessageList messageActions={actions} />}
        {!gallery && (
          <MessageInput focus overrideSubmitHandler={overrideSubmitHandler} />
        )}
        {gallery && (
          <div className="flex h-full flex-wrap items-start justify-start gap-2 overflow-auto p-[10px]">
            {purchasedContent
              ? paidContent.map((media, index) => (
                  <GalleryMedia
                    key={index}
                    media={media}
                    purchasedContent={purchasedContent}
                    pendingContent={pendingContent}
                    isCreator={isCreator}
                  />
                ))
              : pendingContent.map((media, index) => (
                  <GalleryMedia
                    key={index}
                    media={media}
                    purchasedContent={purchasedContent}
                    pendingContent={pendingContent}
                    isCreator={isCreator}
                  />
                ))}
          </div>
        )}
      </Window>
      <Thread
        Input={isCreator ? MessagingInput : MessagingInputFanPerspective}
      />
    </>
  )
}

export const GalleryMedia = ({ media, purchasedContent, isCreator }) => {
  const [openBuyPostModal, setOpenBuyPostModal] = useState(false)
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#ffff]/20 bg-[#1b141d]/50 p-4 sm:max-w-[235px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex cursor-pointer items-center justify-start gap-[6px]">
          <span className="text-[16px] font-medium leading-[22px] text-white ">
            {purchasedContent ? "Purchased" : "Pending"}
          </span>
          <div className="flex items-center gap-1">
            <span>
              <CostIcon />
            </span>
            <span className="text-[16px] font-bold leading-[25px] text-white/90">
              {media.price}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[12px] font-medium uppercase leading-[12px] tracking-[1px] text-white opacity-50">
            {media.date}
          </span>
        </div>
      </div>
      <div>
        <p className="text-[16px] font-medium leading-[22px] text-white">
          Lorem ipsum dolor... Post description here.
        </p>
      </div>
      {isCreator ? (
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
          <img // eslint-disable-line @next/next/no-img-element
            src="/pages/messages/example-photo-gallery.png"
            className="rounded-[20px] object-fill  backdrop-blur-[100px] "
            alt="photo"
            // TODO: use crop images when images come from our db
          />
          {!purchasedContent && (
            <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-[20px] backdrop-blur-[100px]">
              <ImageIcon />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="relative w-full bg-transparent ">
            <div
              className={classNames(
                !media.locked ? "" : "bg-[#1B141D]/50 backdrop-blur-[40px]",
                "absolute flex h-full w-full items-center justify-center rounded-[20px]"
              )}
            >
              {media.locked && (
                <div className="flex-center h-45 flex w-[245px] flex-col items-center ">
                  <PostUnlockButton
                    onClick={() => setOpenBuyPostModal(media)}
                    value={media.locked}
                    name={`Unlock For ${formatCurrency(media.price ?? 100)}`}
                    className="max-w-[165px] gap-1 py-2 text-[14px]"
                  />
                  <div className="flex items-center justify-center px-2 pt-4 text-[#ffffff]">
                    <span>Unlock 4 videos, 20 photos</span>
                  </div>
                </div>
              )}
            </div>
            <img // eslint-disable-line @next/next/no-img-element
              src="/pages/messages/example-photo-gallery.png"
              alt=""
              className="w-full rounded-[20px] object-cover shadow-xl"
            />
          </div>
          <BuyPostModal
            isOpen={openBuyPostModal}
            setOpen={setOpenBuyPostModal}
          />
        </>
      )}
    </div>
  )
}
