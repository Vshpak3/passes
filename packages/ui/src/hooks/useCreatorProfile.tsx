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
    const { profileImage, profileCoverImage, ...rest } = values

    const contentService = new ContentService()

    const [profileImageUrl, profileCoverImageUrl] = await Promise.all([
      profileImage?.length
        ? contentService.uploadProfileImage(profileImage[0])
        : undefined,
      profileCoverImage?.length
        ? contentService.uploadProfileBanner(profileCoverImage[0])
        : undefined
    ])

    const newValues = { ...rest }

    newValues.fullName = `${values.firstName} ${values.lastName}`

    if (profileImageUrl) newValues.profileImageUrl = profileImageUrl
    if (profileCoverImageUrl)
      newValues.profileCoverImageUrl = profileCoverImageUrl

    setProfile(newValues as any)
    const api = new ProfileApi()
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
