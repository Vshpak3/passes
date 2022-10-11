import { PostDto } from "@passes/api-client"
import VerifiedSmall from "public/icons/post-verified-small-icon.svg"
import TimeAgo from "react-timeago"
import {
  PostStatisticsButton,
  PostStatisticsButtonProps
} from "src/components/molecules/post/PostStatisticsButton"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileComponents"

import { DropdownOption, PostDropdown } from "./PostDropdown"

interface PostProfileAvatarProps
  extends Pick<
    PostDto,
    "createdAt" | "displayName" | "isOwner" | "postId" | "userId" | "username"
  > {
  dropdownOptions: DropdownOption[]
  statisticsButtonProps?: PostStatisticsButtonProps
}

export const PostProfileAvatar: React.FC<PostProfileAvatarProps> = ({
  createdAt,
  displayName,
  isOwner,
  postId,
  userId,
  username,
  dropdownOptions,
  statisticsButtonProps
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center space-x-4">
        <ProfileThumbnail userId={userId} />
        <div className="space-y-1 font-medium dark:text-white">
          {/* TODO: consider making this not link for non-creator comments */}
          <a href={`${window.location.origin}/${username}`}>
            <div className="flex items-center gap-[6px]">
              <span className="whitespace-nowrap font-semibold text-[#ffffff] md:text-[20px] md:leading-[25px]">
                {displayName}
              </span>
              <span className="flex items-center">
                <VerifiedSmall />
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              @{username}
            </div>
          </a>
        </div>
      </div>
      <div className="-mt-[21px] flex flex-col-reverse items-end md:flex-row md:items-center md:gap-2">
        <div className="leading=[22px] text-[10px] font-medium tracking-[1px] text-[#FFFFFF]/50 md:text-[12px]">
          <TimeAgo
            className="uppercase text-gray-300/60"
            date={createdAt || ""} // TODO: post.date}
            minPeriod={30}
          />
        </div>
        {isOwner && statisticsButtonProps && (
          <PostStatisticsButton {...statisticsButtonProps} />
        )}

        <div className="flex items-center gap-[15px]">
          {/* <div
          onClick={() => setPostPinned(!postPinned)}
          className={classNames(
            postPinned ? "gap-[10px] rounded-lg bg-[#FFFFFF]/10 px-[10px]" : "",
            "flex cursor-pointer items-center py-[5px] "
          )}
        >
          {postPinned && (
            <span className="text-[12px] font-medium leading-[22px]">
              Pinned post
            </span>
          )}
          {postPinned ? <PinnedActive /> : <PinnedInactive />}
        </div> */}
          <PostDropdown
            items={dropdownOptions}
            username={username}
            postId={postId}
          />
        </div>
      </div>
    </div>
  )
}
