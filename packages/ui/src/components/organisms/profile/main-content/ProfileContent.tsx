import { FC, memo, useEffect, useState } from "react"

import { ProfileContentFeed } from "./feed/ProfileContentFeed"
import {
  ProfileNavigation,
  ProfileNavigationOptions
} from "./ProfileNavigation"

interface ProfileContentProps {
  tab: ProfileNavigationOptions
}

const UnMemoizedProfileContent: FC<ProfileContentProps> = ({ tab }) => {
  if (!Object.values(ProfileNavigationOptions).includes(tab)) {
    tab = ProfileNavigationOptions.POST
  }

  const [activeTab, setActiveTab] = useState(tab)

  useEffect(() => {
    history.replaceState(
      window.history.state,
      "",
      activeTab === ProfileNavigationOptions.POST ? " " : `#${activeTab}`
    )
  }, [activeTab])

  return (
    <div>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed activeTab={activeTab} />
    </div>
  )
}

export const ProfileContent = memo(UnMemoizedProfileContent)
