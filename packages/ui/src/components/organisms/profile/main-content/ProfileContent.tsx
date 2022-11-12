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
    history.replaceState(window.history.state, "", `#${activeTab}`)
  }, [activeTab])
  return (
    <div>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-safe-h-screen min-h-[100vh]">
        <ProfileContentFeed activeTab={activeTab} />
      </div>
    </div>
  )
}

export const ProfileContent = memo(UnMemoizedProfileContent)
