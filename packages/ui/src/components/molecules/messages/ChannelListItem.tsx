import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import classNames from "classnames"
import { FC, memo } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { Time } from "src/components/atoms/Time"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { formatCurrency } from "src/helpers/formatters"

interface ChannelListItemProps {
  onClick: () => void
  channel: ChannelMemberDto
  isSelected?: boolean
}

const ChannelListItemUnmemo: FC<ChannelListItemProps> = ({
  onClick,
  channel,
  isSelected
}) => {
  const api = new MessagesApi()
  const read = async () => {
    if (channel.channelId) {
      await api.readMessages({
        readChannelRequestDto: {
          channelId: channel.channelId,
          otherUserId: channel.otherUserId
        }
      })
    }
  }
  let preview: string | null | JSX.Element = channel?.previewText
  if (!preview || !preview.trim().length) {
    preview = <br />
  }
  return (
    <div
      className={classNames(
        "relative my-2 mx-[4px] w-full cursor-pointer items-center rounded-md p-1 px-3 hover:bg-white/10",
        isSelected && "bg-white/10"
      )}
      onClick={() => {
        read()
        onClick()
      }}
    >
      {!!channel.recent && !!channel.unread && !isSelected && (
        <div className="absolute left-[1px] top-[calc(50%-4px)] z-50 h-[8px] w-[8px] rounded-[4px] bg-passes-primary-color" />
      )}
      <div className="flex w-full items-start">
        <div className="flex pr-[10px]">
          <ProfileImage
            key={channel.otherUserId}
            type="thumbnail"
            userId={channel.otherUserId}
          />
        </div>
        <div className="flex w-full justify-between overflow-x-hidden">
          <div className="flex w-full flex-col items-start justify-center">
            <NameDisplay
              displayName={channel.otherUserDisplayName}
              displayNameClassName="text-[16px] font-medium leading-[24px] text-white"
              isCreator={channel.otherUserIsCreator}
              username={channel.otherUserUsername}
            />
            <p
              className={classNames(
                channel.unread
                  ? "font-bold text-white/60"
                  : "font-medium text-white/30",
                "w-[60%] truncate text-[14px]"
              )}
            >
              {preview}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        {channel?.unreadTip !== 0 && (
          <span className="absolute top-0 right-[7px] items-center self-end rounded-md border border-passes-primary-color bg-[#3B1127] p-0.5 text-center text-[11px] font-bold text-passes-primary-color">
            Tip: {formatCurrency(channel?.unreadTip)}
          </span>
        )}
      </div>
      <Time
        buffer={1}
        className={classNames(
          channel.unread
            ? "font-bold text-white/60"
            : "font-medium text-white/30",
          "absolute right-4 bottom-1 self-end text-[11px] leading-[17px]"
        )}
        date={channel?.recent}
        key={channel.channelId}
      />
    </div>
  )
}

export const ChannelListItem = memo(ChannelListItemUnmemo)
