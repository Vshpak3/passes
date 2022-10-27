import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { isAfter, subDays } from "date-fns"
import { FC, useState } from "react"
import TimeAgo from "react-timeago"

import { MediaContent } from "src/components/molecule/profile/post/MediaContent"
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
          <ProfileThumbnail userId={message.senderId} />
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
            <div className="max-w-[403px] pt-2">
              <MediaContent
                contents={messageContent}
                isProcessing={!message.contentProcessed}
                paying={message.paying}
                paid={!!message.paidAt || !!isOwnMessage}
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
            // </div>
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
