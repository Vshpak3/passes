import { PostDto } from "@passes/api-client"
import PinIcon from "public/icons/new-pin-icon.svg"
import SingleDot from "public/icons/single-dot.svg"
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
    <div className="flex w-full items-center justify-between px-5 sm:px-10 md:px-10 lg:px-5">
      <div className="flex items-center space-x-4 overflow-x-hidden">
        <ProfileWidget isCreator={isCreator} user={user} />
      </div>
      <div className="ml-[10px] mt-[-21px] flex shrink-0 flex-row items-center justify-end ">
        {isPinned && (
          <div className="flex items-center rounded-lg py-1">
            <PinIcon />
            <SingleDot className="ml-[4px]" />
          </div>
        )}
        <div className=" flex items-center text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
          <TimeAgo
            className="mx-[4px] uppercase text-gray-300/60"
            date={createdAt}
            key={id}
            minPeriod={30}
          />
          <SingleDot className="mr-[6px]" />
        </div>
        <div className="mt-[6px] flex items-center">
          <Dropdown items={dropdownOptions} />
        </div>
      </div>
    </div>
  )
}
