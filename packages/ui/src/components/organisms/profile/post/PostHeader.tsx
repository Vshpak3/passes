import { PostDto } from "@passes/api-client"
import classNames from "classnames"
import GraphIcon from "public/icons/graph.svg"
import PinIcon from "public/icons/pin.svg"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import { FC } from "react"
import TimeAgo from "react-timeago"
import {
  PostStatisticsButton,
  PostStatisticsButtonProps
} from "src/components/molecules/post/PostStatisticsButton"
import {
  Dropdown,
  DropdownOption
} from "src/components/organisms/profile/drop-down/Dropdown"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"

interface PostHeaderProps
  extends Pick<
    PostDto,
    "createdAt" | "displayName" | "isOwner" | "userId" | "username"
  > {
  isPinned?: boolean
  dropdownOptions: DropdownOption[]
  statisticsButtonProps?: PostStatisticsButtonProps
}

export const PostHeader: FC<PostHeaderProps> = ({
  createdAt,
  displayName,
  isOwner,
  userId,
  username,
  isPinned,
  dropdownOptions,
  statisticsButtonProps
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <a
        href={`${window.location.origin}/${username}`}
        className={classNames({
          "flex items-center space-x-4 overflow-x-clip": true,
          "pointer-events-none": !displayName
        })}
      >
        <ProfileThumbnail userId={userId} />
        <div className="space-y-1 font-medium dark:text-white">
          <span>
            {displayName && (
              <div className="flex items-center gap-[6px]">
                <>
                  <span className="whitespace-nowrap font-semibold text-[#ffffff] md:text-[20px] md:leading-[25px]">
                    {displayName}
                  </span>
                  <span className="flex items-center">
                    <VerifiedSmall />
                  </span>
                </>
              </div>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @{username}
            </div>
          </span>
        </div>
      </a>
      <div className="ml-[8px] -mt-[21px] flex flex-shrink-0 flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
        <div className="leading=[22px] text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
          <TimeAgo
            className="uppercase text-gray-300/60"
            date={createdAt}
            minPeriod={30}
          />
        </div>
        {isOwner && statisticsButtonProps && (
          <PostStatisticsButton {...statisticsButtonProps} />
        )}
        {isPinned && (
          <div className="relative flex flex-shrink-0 items-center rounded-lg bg-white/10 py-[5px] px-2.5">
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
