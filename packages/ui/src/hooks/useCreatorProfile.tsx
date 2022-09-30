import {
  FanWallApi,
  FeedApi,
  GetProfileResponseDto,
  UserApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"

import { updateProfile } from "../helpers"
import { isProd } from "../helpers/env"
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

  // Disable test profile on production
  const isTestProfile: boolean = username === "test" && !isProd

  const { user: { username: loggedInUsername } = {} } = useUser()

  const ownsProfile = loggedInUsername === username

  const { data: profilePosts = { posts: [] }, isValidating: isLoadingPosts } =
    useSWR(doesProfileExist ? ["/post/creator/", username] : null, async () => {
      const api = new FeedApi()
      return await api.getFeedForCreator({
        getProfileFeedRequestDto: { creatorId: props.userId }
      })
    })

  const onSubmitEditProfile = async (values: Record<string, any>) => {
    const newProfileValues = await updateProfile(values)
    setProfile(newProfileValues as any)
    setEditProfile(false)
    if (values.username !== username) {
      await updateUsername(values.username)
    }
  }

  const updateUsername = async (username: string) => {
    const api = new UserApi()
    await api.setUsername({
      updateUsernameRequestDto: {
        username
      }
    })
    router.replace("/" + username, undefined, { shallow: true })
  }

  return {
    creatorPasses,
    editProfile,
    isLoadingPosts,
    isTestProfile,
    onEditProfile,
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
