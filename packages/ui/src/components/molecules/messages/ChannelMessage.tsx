import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { isAfter, subDays } from "date-fns"
import Locked from "public/icons/lock-locked.svg"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { MediaContent } from "src/components/molecule/profile/post/MediaContent"
import { BuyMessageModal } from "src/components/organisms/payment/BuyMessageModal"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { Avatar } from "./Avatar"
import { CompletedAvatar } from "./CompletedAvatar"

interface ChannelMessageProps {
  isOwnMessage?: boolean
  message: MessageDto
  otherUserDisplayName: string | undefined
  otherUserUsername: string
  user: any
}
export const ChannelMessage: FC<ChannelMessageProps> = ({
  message,
  isOwnMessage = false,
  otherUserDisplayName,
  otherUserUsername,
  user
}) => {
  const messageBackground = isOwnMessage ? "bg-black" : "bg-[#1E1820]"
  const messageContent = message ? message.contents : []

  const [openBuyMessageModal, setOpenBuyMessageModal] = useState(false)
  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        isOwnMessage && "flex-row-reverse self-end"
      )}
    >
      {!isOwnMessage && (
        <div className="flex flex-shrink-0 items-end">
          <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
        </div>
      )}

      <div className="mx-4 flex flex-col items-end">
        <div
          className={`rounded border border-[#363037] ${messageBackground} py-3 px-4`}
        >
          {message?.tipAmount ? (
            <>
              {formatCurrency(message.tipAmount)}
              <br />
            </>
          ) : (
            <></>
          )}

          {!!messageContent.length && (
            <div className="flex w-full flex-col">
              <div className="flex flex-shrink-0 items-start justify-between">
                <CompletedAvatar
                  senderId={message.senderId}
                  otherUserDisplayName={otherUserDisplayName}
                  otherUserUsername={otherUserUsername}
                  user={user}
                />
                {message.paidAt ? (
                  <div className="flex flex-shrink-0 items-center gap-[6px]">
                    <Locked />
                    <span className="text-[14px] font-medium leading-[0px] text-[#767676]">
                      Purchased
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="max-w-[403px] pt-2">
                <MediaContent
                  contents={messageContent}
                  isProcessing={!message.contentProcessed}
                  paying={message.paying}
                  paidAt={message.paidAt}
                  previewIndex={message.previewIndex}
                  price={message.price}
                  openBuyModal={() => setOpenBuyMessageModal(true)}
                />
                {openBuyMessageModal && (
                  <BuyMessageModal
                    message={message}
                    isOpen={openBuyMessageModal}
                    setOpen={setOpenBuyMessageModal}
                  />
                )}
              </div>
            </div>
          )}
          <span className="break-all">{formatText(message?.text)}</span>

          {!message?.pending && message.sentAt && (
            <>
              {isAfter(message.sentAt, subDays(new Date(), 1)) ? (
                <TimeAgo
                  className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30"
                  date={message?.sentAt ? message.sentAt : ""}
                  minPeriod={30}
                />
              ) : (
                <span className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30">
                  {message?.sentAt?.toLocaleDateString()}
                </span>
              )}
            </>
          )}
        </div>
        {!!message?.pending && (
          <span className="text-md mt-2 text-gray-500">Pending...</span>
        )}
      </div>
    </div>
  )
}
