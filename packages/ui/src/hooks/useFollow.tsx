import { FollowApi } from "@passes/api-client"
import { useRouter } from "next/router"
import useSWR from "swr"

import useUser from "./useUser"

const useFollow = (creatorId: string) => {
  const api = new FollowApi()
  const { user } = useUser()
  const router = useRouter()
  const fetchIsFollowing = async () => {
    return await api.checkFollow({
      creatorId
    })
  }
  const { data, error, mutate } = useSWR(
    ["/fan-wall/creator/", creatorId],
    fetchIsFollowing
  )

  const follow = async () => {
    if (!user) {
      router.push("/login")
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
    unfollow
  }
}

export default useFollow
