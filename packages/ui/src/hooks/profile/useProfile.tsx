import { CreatorStatsApi, ProfileApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ProfileUpdate } from "src/helpers/updateProfile"
import { useUser } from "src/hooks/useUser"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PROFILE_INFO = "/profile/info"
const CACHE_KEY_PROFILE_STATS = "/profile/stats"

export const useProfile = () => {
  const profileApi = new ProfileApi()
  const creatorStatsApi = new CreatorStatsApi()

  const router = useRouter()

  const [profileUsername, setProfileUsername] = useState<string>()

  const { user: { username: loggedInUsername } = {} } = useUser()
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

  // For a brief moment during rendering, loadingProfileInfo will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(!!profileInfo)

  const {
    data: profileStats,
    isValidating: loadingProfileStats,
    mutate: mutateProfileStats
  } = useSWR(
    profileInfo?.userId ? [CACHE_KEY_PROFILE_STATS, profileInfo?.userId] : null,
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

  // Secondary useEffect to get the profile
  useEffect(() => {
    if (!profileInfo) {
      mutateProfileInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername, mutateProfileInfo])

  // Final useEffect to get all other info
  useEffect(() => {
    if (profileInfo?.userId && !profileStats) {
      mutateProfileStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo?.userId, mutateProfileStats])

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<ProfileUpdate>) =>
    _mutateManual([CACHE_KEY_PROFILE_INFO, profileUsername], update, {
      populateCache: (
        update: Partial<ProfileUpdate>,
        original: ProfileUpdate
      ) => {
        return Object.assign(original, update)
      },
      revalidate: false
    })

  const ownsProfile = loggedInUsername === profileUsername

  return {
    profileInfo,
    profileUserId: profileInfo?.userId,
    loadingProfileInfo,
    mutateProfileInfo,
    hasInitialFetch,
    profileStats,
    loadingProfileStats,
    mutateProfileStats,
    mutateManual,
    ownsProfile,
    profileUsername
  }
}
