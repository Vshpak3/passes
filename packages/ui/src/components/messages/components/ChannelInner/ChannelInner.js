import ImageIcon from "public/icons/messages-image-icon.svg"
import CostIcon from "public/icons/post-cost-icon.svg"
import React, { useContext, useState } from "react"
import { PostUnlockButton } from "src/components/atoms"
// import BuyMessagesModal from "src/components/organisms/BuyMessagesModal"
import BuyPostModal from "src/components/organisms/BuyPostModal"
import { classNames, formatCurrency } from "src/helpers"
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

const getChannelUnreadTip = (messagesStats, channel) => {
  const mapChannelId = messagesStats.reduce((map, stat) => {
    map[stat.channelId] = stat
    return map
  }, {})
  if (!mapChannelId[channel.data.id]) {
    return 0
  }
  return mapChannelId[channel.data.id].tipRecieved
}

export const ChannelInner = (props) => {
  // const [openBuyMessagesModal, setOpenBuyMessagesModal] = useState(false)
  const purchasedContent = content.filter((media) => !media.locked)
  const pendingContent = content.filter((media) => media.locked)

  const { channel: activeChannel } = useChatContext(ChatContext)
  const tip = getChannelUnreadTip(props.messagesStats, activeChannel)
  const { theme, toggleMobile, freeMessages } = props
  const { sumPaid, sumPending } = content.reduce(
    function (prev, current) {
      if (!current.locked) {
        prev.sumPending += current.price
      } else {
        prev.sumPaid += current.price
      }
      return prev
    },
    { sumPaid: 0, sumPending: 0 }
  )

  const { isCreator, gallery, activeContent } = useContext(GiphyContext)

  const actions = ["delete", "edit", "flag", "mute", "react", "reply"]

  return (
    <>
      <Window>
        <MessagingChannelHeader
          theme={theme}
          toggleMobile={toggleMobile}
          isCreator={isCreator}
        />
        {isCreator ? (
          <div
            className={classNames(
              gallery
                ? "custom-border-second-header-gallery"
                : "custom-border-second-header",
              " spending-tips-buttons flex min-h-[54px] items-center justify-start gap-[18px] bg-[#1b141d]/50 pl-5 "
            )}
          >
            {!gallery && <span>Tips spent</span>}
            {gallery ? (
              <div className="flex h-full items-center justify-center gap-5">
                <div className="flex cursor-pointer gap-1 text-[16px] font-medium leading-[16px]">
                  <span className="flex cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                    Earnings:
                  </span>
                  <span className="text-passes-secondary-color">
                    {formatCurrency(sumPaid)}
                  </span>
                </div>
                <div className="flex cursor-pointer gap-1 text-[16px] font-medium leading-[16px]">
                  <span className="flex cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                    Pending:
                  </span>
                  <span className="text-passes-secondary-color">
                    {formatCurrency(sumPending)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-start gap-[10px]">
                <div className="m-0 flex cursor-pointer items-center p-0">
                  <span className="flex h-[36px] w-[100px] items-center justify-center rounded-l-[40px] bg-[#E58230] text-[16px] font-medium leading-[16px] text-[#ffff]">
                    Total Tips 👑
                  </span>
                  <span className="flex h-[36px] w-[65px] items-center justify-center rounded-r-[40px] bg-[#D55C26] text-[16px] font-medium leading-[16px] text-[#ffff] ">
                    {tip > 0 ? formatCurrency(tip) : "$0.00"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : !isCreator && !gallery ? (
          <div className="flex items-center justify-between gap-[10px] border-b border-[#FFFF]/10 bg-[#5f2c2f]/50 py-[10px] px-4 backdrop-blur-[25px] ">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-[#FBFBFB]">
                You have
              </span>
              <span className="text-base font-medium text-[#C943A8] ">
                {freeMessages} free
              </span>
              <span className="text-sm font-medium text-[#FBFBFB]">
                messages left.
              </span>
            </div>
            {/* TODO: this features will be added after backend is ready */}
            {/* <span>
              <PostUnlockButton
                onClick={() => setOpenBuyMessagesModal(!openBuyMessagesModal)}
                value={openBuyMessagesModal}
                name="unlock more messages"
                className="gap-[6px] rounded-[50px] bg-[#C943A8] py-[6px] px-[12px] text-sm"
              />
            </span> */}
            {/* <BuyMessagesModal
              isOpen={openBuyMessagesModal}
              setOpen={setOpenBuyMessagesModal}
              freeMessages={freeMessages}
              setFreeMessages={setFreeMessages}
            /> */}
          </div>
        ) : null}
        {!gallery && <MessageList messageActions={actions} />}
        {!gallery && (
          <MessageInput
            focus
            // overrideSubmitHandler={overrideSubmitHandler}
          />
        )}
        {gallery && (
          <div className="flex h-full flex-wrap items-start justify-start gap-2 overflow-auto p-[10px]">
            {activeContent === "All" ? (
              <>
                {content.map((media, index) => (
                  <GalleryMedia
                    key={index}
                    media={media}
                    isCreator={isCreator}
                  />
                ))}
              </>
            ) : activeContent === "Purchased" ? (
              <>
                {purchasedContent.map((media, index) => (
                  <GalleryMedia
                    key={index}
                    media={media}
                    isCreator={isCreator}
                  />
                ))}
              </>
            ) : activeContent === "Not Purchased" ? (
              <>
                {pendingContent.map((media, index) => (
                  <GalleryMedia
                    key={index}
                    media={media}
                    isCreator={isCreator}
                  />
                ))}
              </>
            ) : null}
          </div>
        )}
      </Window>
      <Thread
        Input={isCreator ? MessagingInput : MessagingInputFanPerspective}
      />
    </>
  )
}

export const GalleryMedia = ({ media, isCreator }) => {
  const [openBuyPostModal, setOpenBuyPostModal] = useState(false)

  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#ffff]/20 bg-[#1b141d]/50 p-4 sm:max-w-[235px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex cursor-pointer items-center justify-start gap-[6px]">
          <span className="text-[16px] font-medium leading-[22px] text-white ">
            {!media.locked ? "Purchased" : "Pending"}
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
          {!media.locked && (
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
