import ChatIcon from "public/icons/mail-icon.svg"
import { FC } from "react"

import {
  ButtonTypeEnum,
  PassesPinkButton,
  RoundedIconButton
} from "src/components/atoms/Button"
import { formatText } from "src/helpers/formatters"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { useFollow } from "src/hooks/profile/useFollow"
import { useProfile } from "src/hooks/profile/useProfile"
import { ProfileSocialMedia } from "./ProfileSocialMedia"
import { ProfileStatsDesktop, ProfileStatsMobile } from "./ProfileStats"

interface ProfileInformationProps {
  chatLink: string
}

export const ProfileInformationDesktop: FC<ProfileInformationProps> = ({
  chatLink
}) => {
  const { profile, profileUsername, profileUserId, ownsProfile } = useProfile()
  const { creatorStats } = useCreatorStats(profileUserId)

  const { follow, unfollow, isFollowing } = useFollow(profileUserId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="items-center justify-around truncate md:w-[65%]">
        <span className="w-full truncate text-[32px] font-medium leading-9 text-passes-white-100">
          {profile?.displayName}
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
            {!!profile?.isCreator && (
              <>
                <a href={chatLink}>
                  <RoundedIconButton className="h-[32px] w-[32px] border border-passes-dark-200 bg-[#0E0A0F] p-0">
                    <ChatIcon />
                  </RoundedIconButton>
                </a>
                <PassesPinkButton
                  className="h-[36px] w-[115px]"
                  name={isFollowing ? "Unfollow" : "Follow"}
                  onClick={isFollowing ? unfollow : follow}
                  type={ButtonTypeEnum.SUBMIT}
                />
              </>
            )}
          </div>
        )}
      </div>
      <span className="text-md my-3 font-semibold leading-[22px] text-white">
        {formatText(profile?.description)}
      </span>
      <div className="flex w-full flex-row items-center gap-[68px]">
        <ProfileStatsDesktop
          likes={creatorStats?.numLikes}
          numPosts={creatorStats?.numPosts}
        />
        <ProfileSocialMedia
          discordUsername={profile?.discordUsername}
          facebookUsername={profile?.facebookUsername}
          instagramUsername={profile?.instagramUsername}
          tiktokUsername={profile?.tiktokUsername}
          twitchUsername={profile?.twitchUsername}
          twitterUsername={profile?.twitterUsername}
          youtubeUsername={profile?.youtubeUsername}
        />
      </div>
    </div>
  )
}

export const ProfileInformationMobile: FC<ProfileInformationProps> = ({
  chatLink
}) => {
  const { profile, profileUsername, profileUserId, ownsProfile } = useProfile()
  const { creatorStats } = useCreatorStats(profileUserId)

  const { follow, unfollow, isFollowing } = useFollow(profile?.userId || "")

  return (
    <>
      <span className="w-full truncate text-center text-[18px] font-semibold text-passes-white-100">
        {profile?.displayName}
      </span>
      <div className="align-items flex items-center justify-center rounded-xl bg-passes-white-100/5 px-2 py-1">
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-sm font-normal text-transparent">
          @{profileUsername}
        </span>
      </div>
      <span className="max-w-[300px] text-center text-[14px] font-semibold text-white">
        {formatText(profile?.description)}
      </span>
      <ProfileSocialMedia
        discordUsername={profile?.discordUsername}
        facebookUsername={profile?.facebookUsername}
        instagramUsername={profile?.instagramUsername}
        tiktokUsername={profile?.tiktokUsername}
        twitchUsername={profile?.twitchUsername}
        twitterUsername={profile?.twitterUsername}
        youtubeUsername={profile?.youtubeUsername}
      />
      <ProfileStatsMobile
        likes={creatorStats?.numLikes}
        numPosts={creatorStats?.numPosts}
      />
      {!ownsProfile && (
        <div className="flex space-x-3">
          {!!profile?.isCreator && (
            <>
              <a href={chatLink}>
                <RoundedIconButton className="h-[36px] w-[36px] border border-passes-dark-200 bg-[#0E0A0F] p-0">
                  <ChatIcon />
                </RoundedIconButton>
              </a>
              <PassesPinkButton
                className="h-[36px] w-[115px]"
                name={isFollowing ? "Unfollow" : "Follow"}
                onClick={isFollowing ? unfollow : follow}
                type={ButtonTypeEnum.SUBMIT}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
