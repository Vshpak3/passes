import { GetProfileResponseDto } from "@passes/api-client"
import { FC, useState } from "react"
import useFanWall from "src/hooks/useFanWall"

import ProfileContentFeed from "./feed/ProfileContentFeed"
import ProfileNavigation from "./ProfileNavigation"

export interface MainContentProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
}

const ProfileContent: FC<MainContentProps> = ({
  profile,
  ownsProfile,
  profileUsername
}) => {
  const [activeTab, setActiveTab] = useState("post")

  const { fanWallPosts, writeToFanWall } = useFanWall(profile.userId)

  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed
        profile={profile}
        profileUsername={profileUsername}
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        fanWallPosts={fanWallPosts}
        writeToFanWall={writeToFanWall}
      />
    </>
  )
}

export default ProfileContent
