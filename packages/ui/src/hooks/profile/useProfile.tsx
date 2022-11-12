import { ProfileApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { ProfileUpdate } from "src/helpers/updateProfile"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"
import { useUser } from "src/hooks/useUser"
import { usePinnedPosts } from "./usePinnedPosts"

const CACHE_KEY_PROFILE = "/profile/info"

export const useProfile = () => {
  const api = new ProfileApi()

  const router = useRouter()

  const { user: { username: loggedInUsername } = {} } = useUser()

  const [profileUsername, setProfileUsername] = useState<string>()

  // For a brief moment during rendering, loadingProfile will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false)

  const {
    data: profile,
    isValidating: loadingProfile,
    mutate: mutateProfile
  } = useSWR(
    profileUsername ? [CACHE_KEY_PROFILE, profileUsername] : null,
    async () => {
      setHasInitialFetch(true)
      return await api.findProfile({
        getProfileRequestDto: { username: profileUsername }
      })
    },
    { revalidateOnMount: true }
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
    if (!profile) {
      mutateProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUsername, mutateProfile])

  const { mutate: _mutateManualProfile } = useSWRConfig()
  const mutateManualProfile = (update: Partial<ProfileUpdate>) =>
    _mutateManualProfile([CACHE_KEY_PROFILE, profileUsername], update, {
      populateCache: (
        update: Partial<ProfileUpdate>,
        original: ProfileUpdate
      ) => {
        return Object.assign(original, update)
      },
      revalidate: false
    })

  const ownsProfile = loggedInUsername === profileUsername
  const pinnedPassesHook = useCreatorPinnedPasses(profile?.userId)
  const pinnedPostsHook = usePinnedPosts(profile?.userId)

  return {
    profile,
    loadingProfile,
    mutateProfile,
    mutateManualProfile,

    profileUsername,
    profileUserId: profile?.userId,
    ownsProfile,
    hasInitialFetch,
    ...pinnedPassesHook,
    ...pinnedPostsHook
  }
}
