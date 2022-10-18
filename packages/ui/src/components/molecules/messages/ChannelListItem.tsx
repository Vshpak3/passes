import { ChannelMemberDto } from "@passes/api-client/models"
import classNames from "classnames"
import { FC } from "react"
import TimeAgo from "react-timeago"
import { NameDisplay } from "src/components/atoms/NameDisplay"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency } from "src/helpers/formatters"

interface ChannelListItemProps {
  onClick: () => void
  channel: ChannelMemberDto
  isSelected?: boolean
}

export const ChannelListItem: FC<ChannelListItemProps> = ({
  onClick,
  channel,
  isSelected
}) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        "mb-2 flex cursor-pointer  items-center rounded-md py-[7px] px-[10px] hover:bg-[#ffffff]/10",
        isSelected && "bg-[#ffffff]/10"
      )}
    >
      <div className="item-center flex pr-[10px]">
        <ProfileThumbnail userId={channel.otherUserId} />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-start justify-start">
          <span className="text-[16px] font-medium leading-[24px] text-white">
            <NameDisplay
              displayName={channel.otherUserDisplayName}
              username={channel.otherUserUsername}
            />
          </span>
          <p className="w-[120px] truncate text-[14px] font-medium leading-[17px] text-[#ffff]/30">
            {channel?.previewText ?? ""}
          </p>
        </div>
        <div className="flex flex-col items-center justify-end gap-1">
          {channel?.unreadTip !== 0 && (
            <span className="w-full items-center self-end rounded-[30px] bg-[#BF7AF0] p-1 text-center text-[10px] font-medium leading-[16px] text-[#fff]">
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
