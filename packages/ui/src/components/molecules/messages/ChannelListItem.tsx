import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import classNames from "classnames"
import { FC, memo } from "react"
import TimeAgo from "react-timeago"

import { MessagesNameDisplay } from "src/components/atoms/MessagesNameDisplay"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
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
  return (
    <div
      onClick={() => {
        read()
        onClick()
      }}
      className={classNames(
        "mb-2 flex cursor-pointer  items-center rounded-md py-[7px] px-[10px] hover:bg-[#ffffff]/10",
        isSelected && "bg-[#ffffff]/10"
      )}
    >
      <div className="item-center flex pr-[10px]">
        <ProfileThumbnail userId={channel.otherUserId} />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-start justify-center">
          <span className="text-[16px] font-medium leading-[24px] text-white">
            <MessagesNameDisplay
              displayName={channel.otherUserDisplayName}
              username={channel.otherUserUsername}
            />
          </span>
          <p className="w-[120px] truncate text-[14px] font-medium text-[#ffff]/30">
            {channel?.previewText ?? ""}
          </p>
        </div>
        <div
          className={`flex flex-col items-center gap-1 ${
            channel?.unreadTip !== 0 ? "justify-center" : "justify-end"
          }`}
        >
          {channel?.unreadTip !== 0 && (
            <span className="w-full items-center self-end rounded-md border-2 border-[#FF51A8] p-1 text-center text-[12px] font-bold text-[#FF51A8]">
              Tip: {formatCurrency(channel?.unreadTip)}
            </span>
          )}
          <TimeAgo
            className="self-end text-[11px] font-medium leading-[17px] text-[#fff]/30"
            date={channel?.recent ? channel.recent : ""}
            minPeriod={30}
          />
        </div>
      </div>
    </div>
  )
}

export const ChannelListItem = memo(ChannelListItemUnmemo)
