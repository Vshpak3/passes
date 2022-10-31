import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { isAfter, subDays } from "date-fns"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { MediaContent } from "src/components/molecules/MediaContent"
import { BuyMessageModal } from "src/components/organisms/payment/BuyMessageModal"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency, formatText } from "src/helpers/formatters"

interface ChannelMessageProps {
  isOwnMessage?: boolean
  message: MessageDto
}
export const ChannelMessage: FC<ChannelMessageProps> = ({
  message,
  isOwnMessage = false
}) => {
  const messageBackground = isOwnMessage ? "bg-black" : "bg-[#1E1820]"
  const messageContent = message ? message.contents : []
  const {
    senderId,
    contentProcessed,
    paidAt,
    paying,
    price,
    previewIndex,
    sentAt
  } = message

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
          <ProfileThumbnail userId={senderId} />
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
          ) : null}

          {!!messageContent.length && (
            <div className="max-w-[403px] pt-2">
              <MediaContent
                contents={messageContent}
                isProcessing={!contentProcessed}
                paying={paying}
                paid={!!paidAt || !!isOwnMessage}
                previewIndex={previewIndex}
                price={price}
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
            // </div>
          )}
          <span className="break-all">{formatText(message?.text)}</span>

          {!message?.pending && sentAt && (
            <div className="flex items-center">
              {isAfter(sentAt, subDays(new Date(), 1)) ? (
                <TimeAgo
                  className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30"
                  date={message?.sentAt ? sentAt : ""}
                  minPeriod={30}
                />
              ) : (
                <span className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30">
                  {message?.sentAt?.toLocaleDateString()}
                </span>
              )}
              {!!senderId && !!price && (
                <div className="ml-[20px] flex items-center text-[11px]">
                  <DollarIcon />
                  <span className="ml-[5px] opacity-50">{price}</span>
                  {price && !!paidAt ? (
                    <span className="opacity-50">, paid</span>
                  ) : (
                    <span className="opacity-50">, not paid yet</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {!!message?.pending && (
          <span className="text-md mt-2 text-gray-500">Pending...</span>
        )}
      </div>
    </div>
  )
}
