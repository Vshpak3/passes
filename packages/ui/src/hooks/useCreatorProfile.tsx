import {
  CreatorStatsApi,
  FanWallApi,
  FeedApi,
  GetCreatorStatsResponseDto,
  GetProfileResponseDto,
  PassApi,
  ProfileApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { updateProfile } from "src/helpers"
import { errorMessage } from "src/helpers/error"
import { ProfileUpdate } from "src/helpers/updateProfile"
import useSWR from "swr"

import useUser from "./useUser"

const useCreatorProfile = () => {
  const router = useRouter()
  const { user: { username: loggedInUsername } = {} } = useUser()
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true)
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false)
  const [profileUsername, setProfileUsername] = useState<string>()
  const [creatorStats, setCreatorStats] = useState<GetCreatorStatsResponseDto>()
  const [profile, setProfile] = useState<GetProfileResponseDto>()

  // Initial useEffect to get username from the route
  useEffect(() => {
    if (router.isReady) {
      setProfileUsername(router.query.username as string)
    }
  }, [router])

  // Next useEffect to get the profile
  useEffect(() => {
    if (profileUsername) {
      getProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername])

  // Final useEffect to get all other info
  useEffect(() => {
    if (profile?.userId) {
      getCreatorStats()
      mutatePasses()
      mutatePosts()
      mutateFanWall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  // APIs to retrieve content

  async function getProfile() {
    const profileApi = new ProfileApi()

    try {
      setIsLoadingProfile(true)
      const res = await profileApi.findProfile({
        getProfileRequestDto: { username: profileUsername }
      })
      setProfile(res)
    } catch (error: any) {
      setProfile(undefined)
      errorMessage(error, true)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  async function getCreatorStats() {
    const creatorStatsApi = new CreatorStatsApi()

    try {
      setIsLoadingStats(true)
      if (profile) {
        const res = await creatorStatsApi.getCreatorStats({
          creatorId: profile.userId
        })
        setCreatorStats(res)
      }
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoadingStats(false)
    }
  }

  // SWRs

  const {
    data: creatorPasses = [],
    isValidating: isLoadingCreatorPasses,
    mutate: mutatePasses
  } = useSWR(profile ? ["/pass/created/", profileUsername] : null, async () => {
    if (profile) {
      const api = new PassApi()
      if (profile) {
        return (
          await api.getCreatorPasses({
            getCreatorPassesRequestDto: { creatorId: profile.userId }
          })
        ).passes
      }
    }
  })

  const {
    data: fanWallPosts,
    isValidating: isLoadingFanWallPosts,
    mutate: mutateFanWall
  } = useSWR(
    profile ? ["/fan-wall/creator/", profileUsername] : null,
    async () => {
      const api = new FanWallApi()
      if (profile) {
        return await api.getFanWallForCreator({
          getFanWallRequestDto: { creatorId: profile.userId }
        })
      }
    }
  )

  const {
    data: profilePosts = { posts: [] },
    isValidating: isLoadingPosts,
    mutate: mutatePosts
  } = useSWR(profile ? ["/post/creator/", profileUsername] : null, async () => {
    const api = new FeedApi()
    if (profile?.userId) {
      return await api.getFeedForCreator({
        getProfileFeedRequestDto: { creatorId: profile.userId }
      })
    }
  })

  // Other

  const ownsProfile = loggedInUsername === profileUsername

  const onEditProfile = () => setEditProfile(true)

  const onSubmitEditProfile = async (values: ProfileUpdate) => {
    if (!profile) {
      return
    }

    await updateProfile(values)
    // TODO: fix since this sets extra properties to the profile like prof image
    setProfile(Object.assign(profile, values))
    setEditProfile(false)
  }

  const onCloseEditProfile = () => {
    setEditProfile(false)
  }

  return {
    creatorPasses,
    creatorStats,
    editProfile,
    fanWallPosts,
    isLoadingCreatorPasses,
    isLoadingFanWallPosts,
    isLoadingPosts,
    isLoadingProfile,
    isLoadingStats,
    mutatePosts,
    onCloseEditProfile,
    onEditProfile,
    onSubmitEditProfile,
    ownsProfile,
    posts: profilePosts.posts,
    profile,
    profileUsername
  }
}

export default useCreatorProfile
