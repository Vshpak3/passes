import {
  CreatorStatsApi,
  GetCreatorStatsResponseDto,
  ProfileApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { ProfileUpdate } from "src/helpers/updateProfile"
import { useUser } from "src/hooks/useUser"

const CACHE_KEY_PROFILE_INFO = "/profile/info"
const CACHE_KEY_PROFILE_STATS = "/profile/stats"

export interface ProfileStatsUpdate {
  field: keyof Omit<GetCreatorStatsResponseDto, "userId">
  event: "increment" | "decrement"
}

export const useProfile = () => {
  const profileApi = new ProfileApi()
  const creatorStatsApi = new CreatorStatsApi()

  const router = useRouter()

  const { user: { username: loggedInUsername } = {} } = useUser()

  const [profileUsername, setProfileUsername] = useState<string>()

  // For a brief moment during rendering, loadingProfileInfo will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false)

  const {
    data: profileInfo,
    isValidating: loadingProfileInfo,
    mutate: mutateProfileInfo
  } = useSWR(
    profileUsername ? [CACHE_KEY_PROFILE_INFO, profileUsername] : null,
    async () => {
      setHasInitialFetch(true)
      return await profileApi.findProfile({
        getProfileRequestDto: { username: profileUsername }
      })
    }
  )

  const {
    data: profileStats,
    isValidating: loadingProfileStats,
    mutate: mutateProfileStats
  } = useSWR(
    profileInfo?.userId ? [CACHE_KEY_PROFILE_STATS, profileInfo.userId] : null,
    async () => {
      return await creatorStatsApi.getCreatorStats({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        creatorId: profileInfo!.userId
      })
    }
  )

  // Initial useEffect to get username from the route
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    setProfileUsername(router.query.username as string)
  }, [router])

  // Secondary useEffect to get the profile info and stats
  useEffect(() => {
    if (!profileInfo) {
      mutateProfileInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername, mutateProfileInfo])

  // Final useEffect to get all other info
  useEffect(() => {
    if (profileUsername && !profileStats) {
      mutateProfileStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername, mutateProfileStats])

  const { mutate: _mutateManualProfileInfo } = useSWRConfig()
  const mutateManualProfileInfo = (update: Partial<ProfileUpdate>) =>
    _mutateManualProfileInfo(
      [CACHE_KEY_PROFILE_INFO, profileUsername],
      update,
      {
        populateCache: (
          update: Partial<ProfileUpdate>,
          original: ProfileUpdate
        ) => {
          return Object.assign(original, update)
        },
        revalidate: false
      }
    )

  const { mutate: _mutateManualProfileStats } = useSWRConfig()
  const mutateManualProfileStats = (update: ProfileStatsUpdate) =>
    _mutateManualProfileStats(
      [CACHE_KEY_PROFILE_STATS, profileInfo?.userId],
      update,
      {
        populateCache: (
          update: ProfileStatsUpdate,
          original: GetCreatorStatsResponseDto
        ) => {
          return Object.assign(original, {
            [update.field]:
              (original[update.field] || 0) +
              (update.event === "increment" ? 1 : -1)
          })
        },
        revalidate: false
      }
    )

  const ownsProfile = loggedInUsername === profileUsername

  return {
    profileInfo,
    loadingProfileInfo,
    mutateProfileInfo,
    mutateManualProfileInfo,

    profileStats,
    loadingProfileStats,
    mutateProfileStats,
    mutateManualProfileStats,

    profileUsername,
    profileUserId: profileInfo?.userId,
    ownsProfile,
    hasInitialFetch
  }
}
