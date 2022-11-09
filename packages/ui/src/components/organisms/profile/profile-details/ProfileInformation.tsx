import { FC } from "react"

import { formatText } from "src/helpers/formatters"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { useProfile } from "src/hooks/profile/useProfile"
import { ProfileSocialMedia } from "./ProfileSocialMedia"
import { ProfileStats } from "./ProfileStats"

export const ProfileInformation: FC = () => {
  const { profile, profileUsername, profileUserId } = useProfile()
  const { creatorStats } = useCreatorStats(profileUserId)

  return (
    <div className="flex flex-col items-start">
      <div className="w-full items-center justify-around truncate md:w-[85%]">
        <span className="passes-break ml-[90px] w-full truncate text-[16px] font-medium leading-9 text-passes-white-100 md:ml-0 md:text-[32px]">
          {profile?.displayName}
        </span>
      </div>
      <span className="ml-[88px] -mt-1.5 text-sm font-normal leading-[14px] text-[#8899A6] md:-mt-0.5 md:ml-0 md:text-lg">
        @{profileUsername}
      </span>
      <span className="passes-break my-3 font-semibold leading-[22px] text-white">
        {formatText(profile?.description)}
      </span>
      <div className="mt-1.5 flex w-full flex-row flex-wrap items-center gap-y-[20px] gap-x-[60px]">
        <ProfileStats
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
