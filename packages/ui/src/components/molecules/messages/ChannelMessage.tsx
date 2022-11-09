import { MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { isAfter, subDays } from "date-fns"
import { FC, memo } from "react"
import TimeAgo from "react-timeago"

import { MediaContent } from "src/components/molecules/content/MediaContent"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { useBuyMessageModal } from "src/hooks/context/useBuyMessageModal"
import { DollarSymbol } from "src/icons/DollarSymbol"
import { SpinnerIcon } from "src/icons/SpinnerIcon"

interface ChannelMessageProps {
  ownsMessage?: boolean
  message: MessageDto
  messageUpdate?: Partial<MessageDto>
}
const ChannelMessageUnmemo: FC<ChannelMessageProps> = ({
  message,
  messageUpdate = {},
  ownsMessage = false
}) => {
  const {
    messageId,
    senderId,
    contentProcessed,
    contents,
    paidAt,
    paying,
    pending,
    price,
    previewIndex,
    sentAt,
    tipAmount,
    text
  } = { ...message, ...messageUpdate }

  const messageContent = contents ?? []

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
        Tip: {formatCurrency(tipAmount ?? 0)}
      </span>
    </div>
  )

  return (
    <div
      className={classNames(
        "m-2.5 flex  max-w-[70%] rounded",
        ownsMessage && "flex-row-reverse self-end"
      )}
    >
      {!ownsMessage && (
        <div className="flex shrink-0 items-end">
          <ProfileThumbnail key={senderId} userId={senderId} />
        </div>
      )}
      <div className="mx-2 flex flex-col items-end md:mx-4">
        <div
          className={classNames(
            "relative flex  w-full items-center gap-3 ",
            ownsMessage && "flex-row-reverse self-end"
          )}
        >
          <div
            className={classNames(
              `flex flex-col gap-1 rounded border border-[#363037] p-2.5`,
              `bg-[#18090E]`
            )}
          >
            <span className="passes-break">{formatText(text)}</span>
            {!!messageContent.length && (
              <div className="w-[260px] md:w-[403px]">
                <MediaContent
                  contents={messageContent}
                  isProcessing={!contentProcessed}
                  key={messageId}
                  messagesView
                  openBuyModal={() => setMessage(message)}
                  paid={!!paidAt || !!ownsMessage}
                  paying={paying}
                  previewIndex={previewIndex}
                  price={price}
                />
              </div>
            )}
            {!pending && sentAt && (
              <div className="flex items-center justify-end">
                {!!senderId && !!price && (
                  <div className="flex flex-row items-center text-[11px]">
                    <div>
                      <DollarSymbol />
                    </div>
                    <span className="ml-[5px] opacity-50">{price}</span>
                    {price && !!paidAt ? (
                      <span className="opacity-50">{`, paid ${paidAt.toLocaleDateString()}`}</span>
                    ) : (
                      <span className="opacity-50">, not paid yet</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {!!tipAmount && tipComponent}
        </div>

        {ownsMessage &&
          (pending ? (
            <span className="mt-2 flex flex-row items-center gap-1 text-[11px] text-[#767676]">
              <SpinnerIcon />
              Pending...
            </span>
          ) : (
            <>
              {isAfter(sentAt, subDays(new Date(), 1)) ? (
                <TimeAgo
                  className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30"
                  date={sentAt ?? ""}
                  key={messageId}
                  minPeriod={30}
                />
              ) : (
                <span className="flex text-[11px] font-medium leading-[17px] text-[#fff]/30">
                  {sentAt?.toLocaleDateString()}
                </span>
              )}
            </>
          ))}
      </div>
    </div>
  )
}

export const ChannelMessage = memo(ChannelMessageUnmemo)
