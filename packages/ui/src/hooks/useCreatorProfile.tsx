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
import { toast } from "react-toastify"
import { updateProfile } from "src/helpers"
import { ProfileUpdate } from "src/helpers/updateProfile"
import useSWR from "swr"

import useUser from "./useUser"

const useCreatorProfile = () => {
  const router = useRouter()
  const [profileUsername, setUsername] = useState<string>()

  const { user: { username: loggedInUsername } = {}, accessToken } = useUser()
  useEffect(() => {
    if (router.isReady) {
      setUsername(router.query.username as string)
    }
  }, [router])
  const profileApi = new ProfileApi()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false)

  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [creatorStats, setCreatorStats] = useState<GetCreatorStatsResponseDto>()
  const [profile, setProfile] = useState<GetProfileResponseDto>()

  async function getProfile() {
    try {
      setIsLoading(true)
      const res = await profileApi.findProfile({
        getProfileRequestDto: { username: profileUsername }
      })
      setProfile(res)
    } catch (error: any) {
      setProfile(undefined)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getCreatorStats() {
    try {
      setIsLoadingStats(true)
      if (profile) {
        const res = await new CreatorStatsApi().getCreatorStats(
          {
            creatorId: profile.userId
          },
          { headers: [["Authorization", "Bearer " + accessToken]] }
        )
        setCreatorStats(res)
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      setIsLoadingStats(false)
    }
  }
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

  const onEditProfile = () => setEditProfile(true)

  const ownsProfile = loggedInUsername === profileUsername

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

  const onSubmitEditProfile = async (values: ProfileUpdate) => {
    await updateProfile(values)
    await new Promise((resolve) => setTimeout(resolve, 100))
    await getProfile()
    setEditProfile(false)
  }

  const onCloseEditProfile = () => {
    setEditProfile(false)
  }

  useEffect(() => {
    if (profileUsername) {
      getProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername])

  useEffect(() => {
    if (profile?.userId) {
      getCreatorStats()
      mutatePasses()
      mutatePosts()
      mutateFanWall()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])
  return {
    creatorPasses,
    editProfile,
    isLoadingPosts,
    isLoading,
    isLoadingStats,
    creatorStats,
    onEditProfile,
    onCloseEditProfile,
    onSubmitEditProfile,
    ownsProfile,
    fanWallPosts,
    isLoadingFanWallPosts,
    isLoadingCreatorPasses,
    posts: profilePosts.posts,
    mutatePosts,
    profile,
    profileUsername
  }
}

export default useCreatorProfile
