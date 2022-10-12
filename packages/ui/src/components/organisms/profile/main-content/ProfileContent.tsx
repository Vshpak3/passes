import { FC, memo, useState } from "react"

import { ProfileContentFeed } from "./feed/ProfileContentFeed"
import { NavigationOptions, ProfileNavigation } from "./ProfileNavigation"

const UnMemoizedProfileContent: FC = () => {
  const [activeTab, setActiveTab] = useState(NavigationOptions.POST)

  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed activeTab={activeTab} />
    </>
  )
}

export const ProfileContent = memo(UnMemoizedProfileContent)
