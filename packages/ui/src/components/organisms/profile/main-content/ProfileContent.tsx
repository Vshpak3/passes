import { FC, useState } from "react"

import { ProfileContentFeed } from "./feed/ProfileContentFeed"
import { ProfileNavigation } from "./ProfileNavigation"

export const ProfileContent: FC = () => {
  const [activeTab, setActiveTab] = useState("post")

  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed activeTab={activeTab} />
    </>
  )
}
