import { FC } from "react"

import { formatText } from "src/helpers/formatters"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { useProfile } from "src/hooks/profile/useProfile"
import { ProfileSocialMedia } from "./ProfileSocialMedia"
import { ProfileStatsDesktop } from "./ProfileStats"

export const ProfileInformation: FC = () => {
  const { profile, profileUsername, profileUserId } = useProfile()
  const { creatorStats } = useCreatorStats(profileUserId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="w-[85%] items-center justify-around truncate">
        <span className="passes-break w-full truncate text-[32px] font-medium leading-9 text-passes-white-100">
          {profile?.displayName}
        </span>
      </div>
      <div className="flex w-full justify-between">
        <div className="my-2 flex cursor-pointer items-center justify-center rounded-[50px] bg-passes-white-100/[0.05] px-3 py-[6px]">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
            @{profileUsername}
          </span>
        </div>
      </div>
      <span className="passes-break my-3 font-semibold leading-[22px] text-white">
        {formatText(profile?.description)}
      </span>
      <div className="flex w-full flex-row flex-wrap items-center gap-y-[30px] gap-x-[68px]">
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
