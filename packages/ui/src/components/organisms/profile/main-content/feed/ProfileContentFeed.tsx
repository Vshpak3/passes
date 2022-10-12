import { FC } from "react"
import { NavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { useProfile } from "src/hooks/useProfile"

import { FanWallFeed } from "./FanWallFeed"
import { PassesFeed } from "./PassesFeed"
import { PostFeed } from "./PostFeed"

export interface ProfileContentFeedProps {
  activeTab: NavigationOptions
}

export const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  activeTab
}) => {
  const { profileUserId, ownsProfile, loadingProfileInfo } = useProfile()

  if (loadingProfileInfo || !profileUserId) {
    return <></>
  }

  switch (activeTab) {
    case NavigationOptions.POST:
      return (
        <PostFeed profileUserId={profileUserId} ownsProfile={ownsProfile} />
      )
    case NavigationOptions.FANWALL:
      return <FanWallFeed profileUserId={profileUserId} />
    case NavigationOptions.PASSES:
      return <PassesFeed creatorId={profileUserId} />
  }
}
