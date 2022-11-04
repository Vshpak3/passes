import { PostDto } from "@passes/api-client"
import PinIcon from "public/icons/pin.svg"
import { FC } from "react"
import TimeAgo from "react-timeago"

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
  id: string
}

export const PostHeader: FC<PostHeaderProps> = ({
  id,
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
        <ProfileWidget isCreator={isCreator} user={user} />
      </div>
      <div className="ml-[8px] mt-[-21px] flex shrink-0 flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
        <div className="text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
          <TimeAgo
            className="uppercase text-gray-300/60"
            date={createdAt}
            key={id}
            minPeriod={30}
          />
        </div>
        {isPinned && (
          <div className="relative mb-[5px] flex shrink-0 items-center rounded-lg bg-white/10 py-[0px] px-2 md:mb-0 md:py-[4px]">
            <span className="shrink-0">
              <PinIcon />
            </span>
          </div>
        )}
        <div className="flex shrink-0 items-center gap-[15px]">
          <Dropdown items={dropdownOptions} />
        </div>
      </div>
    </div>
  )
}
