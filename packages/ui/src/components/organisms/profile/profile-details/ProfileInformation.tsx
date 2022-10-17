import ChatIcon from "public/icons/mail-icon.svg"
import { FC } from "react"
import {
  ButtonTypeEnum,
  PassesPinkButton,
  RoundedIconButton
} from "src/components/atoms/Button"
import { compactNumberFormatter } from "src/helpers/formatters"
import { useFollow } from "src/hooks/useFollow"
import { useProfile } from "src/hooks/useProfile"

import { ProfileSocialMedia } from "./ProfileSocialMedia"
import { ProfileStatsMobile } from "./ProfileStats"

export interface ProfileInformationProps {
  onChat: () => void
}

export const ProfileInformationDesktop: FC<ProfileInformationProps> = ({
  onChat
}) => {
  const {
    profileStats,
    ownsProfile,
    profileInfo,
    profileUsername,
    profileUserId
  } = useProfile()

  const { follow, unfollow, isFollowing } = useFollow(profileUserId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="items-center justify-around truncate md:w-[65%]">
        <span className="w-full truncate text-[32px] font-medium leading-9 text-passes-white-100">
          {profileInfo?.displayName}
        </span>
      </div>
      <div className="flex w-full justify-between">
        <div className="my-2 flex cursor-pointer items-center justify-center rounded-[50px] bg-passes-white-100/[0.05] px-3 py-[6px]">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
            @{profileUsername}
          </span>
        </div>
        {!ownsProfile && (
          <div className="align-center flex items-center space-x-3">
            <RoundedIconButton
              className="h-[32px] w-[32px] border border-passes-dark-200 bg-[#0E0A0F] p-0"
              onClick={onChat}
            >
              <ChatIcon />
            </RoundedIconButton>
            <PassesPinkButton
              name={isFollowing ? "Unfollow" : "Follow"}
              type={ButtonTypeEnum.SUBMIT}
              onClick={isFollowing ? unfollow : follow}
              className="h-[36px] w-[115px]"
            />
          </div>
        )}
      </div>
      <span className="text-md my-3 font-semibold leading-[22px] text-white">
        {profileInfo?.description}
      </span>
      <div className="flex w-full flex-row items-center gap-[68px]">
        <div className="flex items-center">
          <div className="flex items-center justify-center">
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {profileStats?.numPosts ?? "-"}
            </span>
            <span className="text-sm font-normal text-passes-white-100/70">
              POSTS
            </span>
          </div>
          <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
          <div className="flex items-center justify-center">
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {compactNumberFormatter(profileStats?.numLikes || 0) ?? "-"}
            </span>
            <span className="text-sm font-normal text-passes-white-100/70">
              LIKES
            </span>
          </div>
        </div>

        <ProfileSocialMedia
          discordUsername={profileInfo?.discordUsername}
          facebookUsername={profileInfo?.facebookUsername}
          instagramUsername={profileInfo?.instagramUsername}
          tiktokUsername={profileInfo?.tiktokUsername}
          twitchUsername={profileInfo?.twitchUsername}
          twitterUsername={profileInfo?.twitterUsername}
          youtubeUsername={profileInfo?.youtubeUsername}
        />
      </div>
    </div>
  )
}

export const ProfileInformationMobile: React.FC<ProfileInformationProps> = ({
  onChat
}) => {
  const { profileStats, ownsProfile, profileInfo, profileUsername } =
    useProfile()

  const { follow, unfollow, isFollowing } = useFollow(profileInfo?.userId || "")

  return (
    <>
      <span className="w-full truncate text-center text-[18px] font-semibold text-passes-white-100">
        {profileInfo?.displayName}
      </span>
      <div className="align-items flex items-center justify-center rounded-xl bg-passes-white-100/5 px-2 py-1">
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-sm font-normal text-transparent">
          @{profileUsername}
        </span>
      </div>
      <span className="max-w-[300px] text-center text-[14px] font-semibold text-white">
        {profileInfo?.description}
      </span>
      <ProfileSocialMedia
        discordUsername={profileInfo?.discordUsername}
        facebookUsername={profileInfo?.facebookUsername}
        instagramUsername={profileInfo?.instagramUsername}
        tiktokUsername={profileInfo?.tiktokUsername}
        twitchUsername={profileInfo?.twitchUsername}
        twitterUsername={profileInfo?.twitterUsername}
        youtubeUsername={profileInfo?.youtubeUsername}
      />
      <ProfileStatsMobile
        numPosts={profileStats?.numPosts || 0}
        likes={profileStats?.numLikes || 0}
      />
      {!ownsProfile && (
        <div className="flex space-x-3">
          <RoundedIconButton
            className="h-[36px] w-[36px] border border-passes-dark-200 bg-[#0E0A0F] p-0"
            onClick={onChat}
          >
            <ChatIcon />
          </RoundedIconButton>
          <PassesPinkButton
            name={isFollowing ? "Unfollow" : "Follow"}
            type={ButtonTypeEnum.SUBMIT}
            onClick={isFollowing ? unfollow : follow}
            className="h-[36px] w-[115px]"
          />
        </div>
      )}
    </>
  )
}
