import { FollowApi } from "@passes/api-client"
import useSWR from "swr"

const useFollow = (creatorId: string) => {
  const api = new FollowApi()
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
    await api.followCreator({
      creatorId
    })

    mutate(fetchIsFollowing, {
      optimisticData: { isFollowing: true },
      rollbackOnError: true
    })
  }

  const unfollow = async () => {
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
