import { FeedApi, GetProfileFeedRequestDto } from "@passes/api-client"
import { useEffect } from "react"
import useSWR from "swr"

export const useFeed = (creatorId: string) => {
  const api = new FeedApi()

  const getFeedForCreator = async (req: GetProfileFeedRequestDto) => {
    return await api.getFeedForCreator({ getProfileFeedRequestDto: req })
  }

  const { data: pinnedPosts = [], mutate: mutatePinnedPosts } = useSWR(
    ["meow", creatorId],
    async () => {
      return (
        await api.getFeedForCreator({
          getProfileFeedRequestDto: { creatorId, pinned: true }
        })
      ).data
    }
  )

  useEffect(() => {
    mutatePinnedPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { getFeedForCreator, pinnedPosts, mutatePinnedPosts }
}
