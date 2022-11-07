import { FeedApi, PostApi, PostDto } from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_FEED_PINNED = "/profile/feed/pinned"

export const usePinnedPosts = (creatorId: string) => {
  const feedApi = new FeedApi()
  const postApi = new PostApi()

  const { data: pinnedPosts, mutate: mutatePinnedPosts } = useSWR(
    [CACHE_KEY_FEED_PINNED, creatorId],
    async () => {
      return (
        await feedApi.getFeedForCreator({
          getProfileFeedRequestDto: { creatorId, pinned: true }
        })
      ).data
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: PostDto[]) =>
    _mutateManual([CACHE_KEY_FEED_PINNED, creatorId], update, {
      populateCache: (update: PostDto[]) => {
        return update
      }
    })

  const pinPost = async (post: PostDto) => {
    await postApi.pinPost({ postId: post.postId })
    post.pinnedAt = new Date()
    const _pinnedPosts = pinnedPosts || []
    _pinnedPosts.push(post)
    _pinnedPosts.sort(
      (a, b) => (a.pinnedAt?.getTime() || 0) - (b.pinnedAt?.getTime() || 0)
    )
    mutateManual(_pinnedPosts)
  }

  const unpinPost = async (post: PostDto) => {
    await postApi.unpinPost({ postId: post.postId })
    post.pinnedAt = null
    if (pinnedPosts) {
      mutateManual(pinnedPosts.filter((p) => p.postId !== post.postId))
    }
  }

  useEffect(() => {
    if (!pinnedPosts) {
      mutatePinnedPosts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    pinnedPosts: pinnedPosts || [],
    mutatePinnedPosts,
    pinPost,
    unpinPost
  }
}
