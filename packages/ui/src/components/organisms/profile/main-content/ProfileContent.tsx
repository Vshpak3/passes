import { FC, memo, useEffect, useState } from "react"

import { ProfileContentFeed } from "./feed/ProfileContentFeed"
import {
  ProfileNavigation,
  ProfileNavigationOptions
} from "./ProfileNavigation"

interface ProfileContentProps {
  tab: ProfileNavigationOptions
}

const UnMemoizedProfileContent: FC<ProfileContentProps> = ({
  tab
}: ProfileContentProps) => {
  if (!Object.values(ProfileNavigationOptions).includes(tab)) {
    tab = ProfileNavigationOptions.POST
  }

  const [activeTab, setActiveTab] = useState(tab)
  useEffect(() => {
    window.location.hash = activeTab
  }, [activeTab])
  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed activeTab={activeTab} />
    </>
  )
}

export const ProfileContent = memo(UnMemoizedProfileContent)
