import { FC } from "react"
import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { useProfile } from "src/hooks/profile/useProfile"

import { FanWallFeed } from "./FanWallFeed"
import { PassesFeed } from "./PassesFeed"
import { PostFeed } from "./PostFeed"

interface ProfileContentFeedProps {
  activeTab: ProfileNavigationOptions
}

export const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  activeTab
}) => {
  const { profileUserId, ownsProfile, loadingProfileInfo } = useProfile()

  if (loadingProfileInfo || !profileUserId) {
    return <></>
  }

  switch (activeTab) {
    case ProfileNavigationOptions.POST:
      return (
        <PostFeed profileUserId={profileUserId} ownsProfile={ownsProfile} />
      )
    case ProfileNavigationOptions.FANWALL:
      return (
        <FanWallFeed profileUserId={profileUserId} ownsProfile={ownsProfile} />
      )
    case ProfileNavigationOptions.PASSES:
      return <PassesFeed creatorId={profileUserId} />
  }
}
