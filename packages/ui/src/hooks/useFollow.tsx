import { FollowApi } from "@passes/api-client"
import { useRouter } from "next/router"
import useSWR from "swr"

import { useUser } from "./useUser"

const CACHE_KEY_FOLLOW = "/profile/follow/creator/"

export const useFollow = (creatorId: string) => {
  const api = new FollowApi()
  const { user } = useUser()
  const router = useRouter()

  const fetchIsFollowing = async () => {
    return await api.checkFollow({ creatorId })
  }

  const { data, error, mutate } = useSWR(
    [CACHE_KEY_FOLLOW, creatorId],
    fetchIsFollowing
  )

  const follow = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    await api.followCreator({
      creatorId
    })

    mutate(fetchIsFollowing, {
      optimisticData: { isFollowing: true },
      rollbackOnError: true
    })
  }

  const unfollow = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    await api.unfollowCreator({
      creatorId
    })

    mutate(fetchIsFollowing, {
      optimisticData: { isFollowing: false },
      rollbackOnError: true
    })
  }

  return {
    isFollowing: data?.isFollowing,
    error,
    follow,
    unfollow,
    loadFollow: mutate
  }
}
