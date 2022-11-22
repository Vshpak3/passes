import { ChannelMemberDto, MessageDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, memo } from "react"

import { Time } from "src/components/atoms/Time"
import { MediaContent } from "src/components/molecules/content/MediaContent"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { useBuyMessageModal } from "src/hooks/context/useBuyMessageModal"
import { DollarSymbol } from "src/icons/DollarSymbol"
import { SpinnerIcon } from "src/icons/SpinnerIcon"

interface ChannelMessageProps {
  ownsMessage?: boolean
  message: MessageDto
  messageUpdate?: Partial<MessageDto>
  showReadAt?: boolean
  selectedChannel?: ChannelMemberDto
  inChannel?: boolean
}
const ChannelMessageUnmemo: FC<ChannelMessageProps> = ({
  message,
  messageUpdate = {},
  ownsMessage = false,
  showReadAt = false,
  selectedChannel,
  inChannel = true
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

  const { setMessage, setSelectedChannel } = useBuyMessageModal()
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
    <>
      <div
        className={classNames(
          "m-2.5 flex rounded",
          ownsMessage && "flex-row-reverse self-end",
          inChannel && "max-w-[70%]",
          !!messageContent.length && "w-[70%]"
        )}
      >
        {!ownsMessage && (
          <div className="flex shrink-0 items-end">
            <ProfileImage key={senderId} type="thumbnail" userId={senderId} />
          </div>
        )}
        <div
          className={classNames(
            "mx-2 flex flex-col md:mx-4",
            ownsMessage ? "items-end" : "items-start",
            !!messageContent.length && "w-full"
          )}
        >
          <div
            className={classNames(
              "relative flex w-full items-center gap-3 ",
              ownsMessage && "flex-row-reverse self-end"
            )}
          >
            <div
              className={classNames(
                `flex flex-col justify-center gap-1 rounded border border-[#363037] p-2.5`,
                !!messageContent.length && "w-full",
                message.automatic
                  ? `bg-passes-pink-100/[0.32]`
                  : `bg-[#18090E]`,
                ownsMessage ? "items-end" : "items-start"
              )}
            >
              <span className="passes-break whitespace-pre-wrap">
                {formatText(text)}
              </span>
              <div className="flex w-full flex-col items-center justify-center">
                {!!messageContent.length && (
                  <div className="w-full min-w-full max-w-full">
                    <MediaContent
                      contents={messageContent}
                      isOwner={ownsMessage}
                      isProcessing={!contentProcessed}
                      key={messageId}
                      messagesView
                      openBuyModal={
                        selectedChannel
                          ? () => {
                              setSelectedChannel(selectedChannel)
                              setMessage(message)
                            }
                          : () => null
                      }
                      paid={!!paidAt || !!ownsMessage}
                      paying={paying}
                      previewIndex={previewIndex}
                      price={price}
                    />
                  </div>
                )}
              </div>
              {!pending && sentAt && !!price && (
                <div className="flex items-center justify-end">
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
                </div>
              )}
            </div>
            {!!tipAmount && tipComponent}
          </div>

          {pending ? (
            <span className="mt-2 flex flex-row items-center gap-1 text-[11px] text-[#767676]">
              <SpinnerIcon />
              Pending...
            </span>
          ) : (
            <Time
              buffer={1}
              className="flex text-[11px] font-medium leading-[17px] text-white/30"
              date={sentAt}
              key={messageId}
            />
          )}
        </div>
      </div>
      {showReadAt && (
        <div className="flex w-full flex-row justify-evenly text-center text-passes-pink-100">
          <hr className="my-auto w-[40%] border-[0.5px] border-passes-pink-100" />
          <span>New Messages</span>
          <hr className="my-auto w-[40%] border-[0.5px] border-passes-pink-100" />
        </div>
      )}
    </>
  )
}

export const ChannelMessage = memo(ChannelMessageUnmemo)
