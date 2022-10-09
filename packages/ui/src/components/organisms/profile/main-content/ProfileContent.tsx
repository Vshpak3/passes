import { GetProfileResponseDto } from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import { toast } from "react-toastify"
import useFanWall from "src/hooks/useFanWall"
import usePost from "src/hooks/usePost"
import useProfileFeed from "src/hooks/useProfileFeed"

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
  const [isDeletedPost, setIsDeletedPost] = useState(false)

  const { removePost } = usePost()
  const { fanWallPosts, writeToFanWall } = useFanWall(profile.userId)
  const { profilePost, mutatePosts, createPost } = useProfileFeed(
    profile.userId
  )

  useEffect(() => {
    if (isDeletedPost) {
      mutatePosts()
      return setIsDeletedPost(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedPost])

  const removePostHandler = (postId: string) => {
    removePost(postId)
      .then(() => setIsDeletedPost && setIsDeletedPost(true))
      .catch((error) => toast(error))
  }

  return (
    <>
      <ProfileNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileContentFeed
        profile={profile}
        profileUsername={profileUsername}
        activeTab={activeTab}
        ownsProfile={ownsProfile}
        feed={profilePost}
        fanWallPosts={fanWallPosts}
        createPost={createPost}
        removePost={removePostHandler}
        mutatePosts={mutatePosts}
        writeToFanWall={writeToFanWall}
      />
    </>
  )
}

export default ProfileContent
