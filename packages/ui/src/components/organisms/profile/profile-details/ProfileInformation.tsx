import { FC, useContext } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { formatText } from "src/helpers/formatters"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { ProfileContext } from "src/pages/[username]"
import { ProfileSocialMedia } from "./ProfileSocialMedia"
import { ProfileStats } from "./ProfileStats"

export const ProfileInformation: FC = () => {
  const { profile, profileUsername, profileUserId } = useContext(ProfileContext)
  const { creatorStats } = useCreatorStats(profileUserId)

  return (
    <div className="flex flex-col items-start">
      <div className="ml-[90px] flex w-[calc(100%-200px)] flex-col items-center justify-around truncate md:ml-0 md:w-[85%]">
        <NameDisplay
          displayName={profile?.displayName ?? ""}
          displayNameClassName="text-[16px] font-medium md:leading-9 mt-2 md:mt-0 text-white md:text-[32px]"
          horizontal={false}
          isCreator={!!profile?.isCreator}
          username={profileUsername ?? ""}
        />
      </div>
      <span className="passes-break my-3 whitespace-pre-wrap font-[500] leading-[22px] text-white">
        {formatText(profile?.description)}
      </span>
      <div className="mt-1.5 flex w-full flex-row flex-wrap items-center gap-y-[20px] gap-x-[60px]">
        <ProfileStats
          likes={creatorStats?.numLikes}
          numPosts={creatorStats?.numPosts}
        />
        <ProfileSocialMedia
          // discordUsername={profile?.discordUsername}
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
