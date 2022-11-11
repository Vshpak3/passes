import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import classNames from "classnames"
import { FC, memo } from "react"
import TimeAgo from "react-timeago"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
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
        channelId: channel.channelId
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
        "relative my-2 mx-[4px] w-full cursor-pointer items-center rounded-md p-1 px-3 hover:bg-[#ffffff]/10",
        isSelected && "bg-[#ffffff]/10"
      )}
      onClick={() => {
        read()
        onClick()
      }}
    >
      {!!channel.recent && !!channel.unread && !isSelected && (
        <div className="absolute left-[1px] top-[calc(50%-4px)] z-50 h-[8px] w-[8px] rounded-[4px] bg-[#FF51A8]" />
      )}
      <div className="flex w-full items-start">
        <div className="flex pr-[10px]">
          <ProfileImage
            key={channel.otherUserId}
            type="thumbnail"
            userId={channel.otherUserId}
          />
        </div>
        <div className="flex justify-between overflow-x-hidden">
          <div className="flex w-full flex-col items-start justify-center">
            <NameDisplay
              displayName={channel.otherUserDisplayName}
              displayNameClassName="text-[16px] font-medium leading-[24px] text-white"
              isCreator={channel.otherUserIsCreator}
              username={channel.otherUserUsername}
            />
            <p className="w-[60%] truncate text-[14px] font-medium text-[#ffff]/30">
              {preview}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        {channel?.unreadTip !== 0 && (
          <span className="absolute top-0 right-[7px] items-center self-end rounded-md border border-[#FF51A8] p-0.5 text-center text-[11px] font-bold text-[#FF51A8]">
            Tip: {formatCurrency(channel?.unreadTip)}
          </span>
        )}
      </div>
      <TimeAgo
        className="absolute right-4 bottom-1 self-end text-[11px] font-medium leading-[17px] text-[#fff]/30"
        date={channel?.recent ? channel.recent : ""}
        key={channel.channelId}
        minPeriod={30}
      />
    </div>
  )
}

export const ChannelListItem = memo(ChannelListItemUnmemo)
