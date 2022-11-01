import { FollowApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

import { useUser } from "src/hooks/useUser"

const CACHE_KEY_FOLLOW = "/profile/follow/"

export const useFollow = (creatorId?: string) => {
  const api = new FollowApi()
  const { user } = useUser()
  const router = useRouter()

  const { data: isFollowing, mutate } = useSWR<boolean | undefined>(
    creatorId ? [CACHE_KEY_FOLLOW, creatorId] : null,
    async () => {
      if (user?.userId === creatorId) {
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return (await api.checkFollow({ creatorId: creatorId! })).isFollowing
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: boolean) =>
    _mutateManual([CACHE_KEY_FOLLOW, creatorId], update, {
      populateCache: (update: boolean) => {
        return update
      },
      revalidate: false
    })

  const follow = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!creatorId) {
      return
    }
    await api.followCreator({ creatorId })

    mutateManual(true)
  }

  const unfollow = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    if (!creatorId) {
      return
    }
    await api.unfollowCreator({ creatorId })

    mutateManual(false)
  }

  useEffect(() => {
    if (isFollowing === undefined && creatorId) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorId, mutate])

  return {
    isFollowing,
    follow,
    unfollow,
    loadFollow: mutate
  }
}
