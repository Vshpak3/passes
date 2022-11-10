import { FC, useContext } from "react"

import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { ProfileContext } from "src/pages/[username]"
import { FanWallFeed } from "./FanWallFeed"
import { PassesFeed } from "./PassesFeed"
import { PostFeed } from "./PostFeed"

interface ProfileContentFeedProps {
  activeTab: ProfileNavigationOptions
}

export const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  activeTab
}) => {
  const { profileUserId, ownsProfile, loadingProfile } =
    useContext(ProfileContext)

  if (loadingProfile || !profileUserId) {
    return null
  }

  switch (activeTab) {
    case ProfileNavigationOptions.POST:
      return (
        <PostFeed ownsProfile={ownsProfile} profileUserId={profileUserId} />
      )
    case ProfileNavigationOptions.FANWALL:
      return (
        <FanWallFeed ownsProfile={ownsProfile} profileUserId={profileUserId} />
      )
    case ProfileNavigationOptions.PASSES:
      return <PassesFeed creatorId={profileUserId} />
  }
}
