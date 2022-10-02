import { FanWallApi, FeedApi, GetProfileResponseDto } from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"

import { updateProfile } from "../helpers"
import { ProfileUpdate } from "../helpers/updateProfile"
import usePasses from "./usePasses"
import useUser from "./useUser"

const useCreatorProfile = (props: GetProfileResponseDto) => {
  const doesProfileExist = Object.keys(props).length > 0

  const router = useRouter()
  const { username: _username } = router.query
  const username = _username as string

  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [profile, setProfile] = useState<GetProfileResponseDto>(props)

  const { creatorPasses } = usePasses(profile.userId)

  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR(
      doesProfileExist ? ["/fan-wall/creator/", username] : null,
      async () => {
        const api = new FanWallApi()
        return await api.getFanWallForCreator({
          getFanWallRequestDto: { creatorId: props.userId }
        })
      }
    )

  const onEditProfile = () => setEditProfile(true)

  const { user: { username: loggedInUsername } = {} } = useUser()

  const ownsProfile = loggedInUsername === username

  const { data: profilePosts = { posts: [] }, isValidating: isLoadingPosts } =
    useSWR(doesProfileExist ? ["/post/creator/", username] : null, async () => {
      const api = new FeedApi()
      return await api.getFeedForCreator({
        getProfileFeedRequestDto: { creatorId: props.userId }
      })
    })

  const onSubmitEditProfile = async (values: ProfileUpdate) => {
    await updateProfile(values)
    setProfile(values as GetProfileResponseDto) // TODO fix this
    setEditProfile(false)
    if (values.username !== username) {
      router.replace("/" + username, undefined, { shallow: true })
    }
  }

  const onCloseEditProfile = () => {
    setEditProfile(false)
  }

  return {
    creatorPasses,
    editProfile,
    isLoadingPosts,
    onEditProfile,
    onCloseEditProfile,
    onSubmitEditProfile,
    ownsProfile,
    fanWallPosts,
    isLoadingFanWallPosts,
    posts: profilePosts.posts,
    profile,
    username
  }
}

export default useCreatorProfile
