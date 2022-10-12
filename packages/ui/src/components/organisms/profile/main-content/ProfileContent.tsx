import { FC, memo, useState } from "react"

import { ProfileContentFeed } from "./feed/ProfileContentFeed"
import { ProfileNavigation } from "./ProfileNavigation"

const UnMemoizedProfileContent: FC = () => {
  const [activeTab, setActiveTab] = useState("post")

  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed activeTab={activeTab} />
    </>
  )
}

export const ProfileContent = memo(UnMemoizedProfileContent)
