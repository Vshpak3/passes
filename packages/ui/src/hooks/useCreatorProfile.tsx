import {
  FanWallApi,
  FeedApi,
  GetProfileResponseDto,
  ProfileApi,
  UserApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import useSWR from "swr"

import { ContentService } from "../helpers"
import { wrapApi } from "../helpers/wrapApi"
import usePasses from "./usePasses"
import useUser from "./useUser"

const useCreatorProfile = (props: GetProfileResponseDto) => {
  const router = useRouter()
  const { username: _username } = router.query
  const username = _username as string

  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [profile, setProfile] = useState<GetProfileResponseDto>(props)

  const { creatorPasses } = usePasses(profile.userId)

  const { data: fanWallPosts = [], isValidating: isLoadingFanWallPosts } =
    useSWR([`/fan-wall/creator/`, username], async () => {
      const api = wrapApi(FanWallApi)
      return await api.getFanWallForCreator({ userId: props.userId })
    })

  const onEditProfile = () => setEditProfile(true)

  // Disable test profile on production
  const isTestProfile: boolean =
    username === "test" && process.env.NEXT_PUBLIC_NODE_ENV !== "prod"

  const { user: { username: loggedInUsername } = {} } = useUser()

  const ownsProfile = loggedInUsername === username

  const { data: posts = [], isValidating: isLoadingPosts } = useSWR(
    [`/post/creator/`, username],
    async () => {
      const api = wrapApi(FeedApi)
      return await api.getFeedForCreator({ userId: props.userId, cursor: "" })
    }
  )

  const onSubmitEditProfile = async (values: Record<string, any>) => {
    const { profileImage, profileCoverImage, ...rest } = values

    const [profileImageUrl, profileCoverImageUrl] =
      await new ContentService().uploadPublicContent(
        [profileImage, profileCoverImage],
        "profile"
      )

    const newValues = { ...rest }

    newValues.fullName = `${values.firstName} ${values.lastName}`

    if (profileImageUrl) newValues.profileImageUrl = profileImageUrl
    if (profileCoverImageUrl)
      newValues.profileCoverImageUrl = profileCoverImageUrl

    setProfile(newValues as any)
    const api = wrapApi(ProfileApi)
    await api.createOrUpdateProfile({
      createOrUpdateProfileRequestDto: {
        ...rest
        // profileImageUrl: profileImageUrl ?? rest.profileImageUrl,
        // profileCoverImageUrl: profileCoverImageUrl ?? rest.profileCoverImageUrl
      }
    })

    setEditProfile(false)

    if (rest.username !== username) await updateUsername(rest.username)
  }

  const updateUsername = async (username: string) => {
    const api = wrapApi(UserApi)
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
    posts,
    profile,
    username
  }
}

export default useCreatorProfile
