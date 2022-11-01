import { PostDto } from "@passes/api-client"
import PinIcon from "public/icons/pin.svg"
import { FC } from "react"
import TimeAgo from "react-timeago"

import { PostStatisticsButtonProps } from "src/components/molecules/post/PostStatisticsButton"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"

interface PostHeaderProps
  extends Pick<PostDto, "createdAt" | "userId" | "username" | "displayName"> {
  isCreator: boolean
  isPinned?: boolean
  dropdownOptions: DropdownOption[]
  statisticsButtonProps?: PostStatisticsButtonProps
}

export const PostHeader: FC<PostHeaderProps> = ({
  createdAt,
  userId,
  username,
  displayName,
  isCreator,
  isPinned,
  dropdownOptions
}) => {
  const user = { userId, username, displayName }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center space-x-4 overflow-x-clip">
        <ProfileWidget user={user} isCreator={isCreator} />
      </div>
      <div className="ml-[8px] -mt-[21px] flex flex-shrink-0 flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
        <div className="leading=[22px] text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
          <TimeAgo
            className="uppercase text-gray-300/60"
            date={createdAt}
            minPeriod={30}
          />
        </div>
        {isPinned && (
          <div className="sm:px-2.5mb-0 relative mb-[5px] flex flex-shrink-0 items-center rounded-lg bg-white/10 py-[0px] px-2 md:mb-0 md:py-[4px]">
            <span className="flex-shrink-0">
              <PinIcon />
            </span>
          </div>
        )}
        <div className="flex flex-shrink-0 items-center gap-[15px]">
          <Dropdown items={dropdownOptions} />
        </div>
      </div>
    </div>
  )
}
