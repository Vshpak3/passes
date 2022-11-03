import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { isAfter, subDays } from "date-fns"
import { FC } from "react"
import TimeAgo from "react-timeago"

import { MediaContent } from "src/components/molecules/content/MediaContent"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { useBuyMessageModal } from "src/hooks/context/useBuyMessageModal"
import { DollarSymbol } from "src/icons/DollarSymbol"
import { DoubleCheckMarkIcon } from "src/icons/DoubleCheckMark"
import { SpinnerIcon } from "src/icons/SpinnerIcon"

interface ChannelMessageProps {
  ownsMessage?: boolean
  message: MessageDto
}
export const ChannelMessage: FC<ChannelMessageProps> = ({
  message,
  ownsMessage = false
}) => {
  const messageBackground = ownsMessage ? "bg-black" : "bg-[#1E1820]"
  const messageContent = message ? message.contents : []
  const {
    messageId,
    senderId,
    contentProcessed,
    paidAt,
    paying,
    price,
    previewIndex,
    sentAt
  } = message

  const { setMessage } = useBuyMessageModal()

  const tipComponent = (
    <div
      className={classNames(
        "flex flex-row items-center gap-2 rounded-sm bg-[#B52A6F40] p-2",
        ownsMessage ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <DollarSymbol dimensions={11} />
      <span className="text-xs font-bold text-white">
        Tip: {formatCurrency(message.tipAmount ?? 0)}
      </span>
    </div>
  )

  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        ownsMessage && "flex-row-reverse self-end"
      )}
    >
      {!ownsMessage && (
        <div className="flex shrink-0 items-end">
          <ProfileThumbnail key={senderId} userId={senderId} />
        </div>
      )}
      <div className="mx-4 flex flex-col items-end">
        <div className="relative flex flex-col items-center gap-3 md:flex-row">
          {!!message?.tipAmount && ownsMessage && tipComponent}
          <div
            className={`flex flex-col gap-1 rounded border border-[#363037] p-2.5 ${messageBackground}`}
          >
            <span className="break-all">{formatText(message?.text)}</span>
            {!!messageContent.length && (
              <div className="max-w-[403px]">
                <MediaContent
                  contents={messageContent}
                  isProcessing={!contentProcessed}
                  key={messageId}
                  openBuyModal={() => setMessage(message)}
                  paid={!!paidAt || !!ownsMessage}
                  paying={paying}
                  previewIndex={previewIndex}
                  price={price}
                />
              </div>
            )}
            {!message?.pending && sentAt && (
              <div className="flex items-center justify-between">
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
                  <div className="ml-10 flex flex-row items-center text-[11px]">
                    <div>
                      <DollarSymbol />
                    </div>
                    <span className="ml-[5px] opacity-50">{price}</span>
                    {price && !!paidAt ? (
                      <span className="opacity-50">{`, paid ${paidAt}`}</span>
                    ) : (
                      <span className="opacity-50">, not paid yet</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {!!message?.tipAmount && !ownsMessage && tipComponent}
        </div>

        {ownsMessage &&
          (message?.pending ? (
            <span className="text-md mt-2 flex flex-row items-center gap-1 text-[#767676]">
              <SpinnerIcon />
              Pending...
            </span>
          ) : (
            <span className="text-md mt-2 flex flex-row items-center gap-1 text-[#767676]">
              <DoubleCheckMarkIcon />
              Sent
            </span>
          ))}
      </div>
    </div>
  )
}
