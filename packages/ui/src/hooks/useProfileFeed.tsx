import { CreatePostRequestDto, FeedApi, PostApi } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_PROFILE_FEED = "/profile/feed/creator/"

const useProfileFeed = (creatorId: string) => {
  const feedApi = new FeedApi()
  const postApi = new PostApi()

  const { mutate } = useSWRConfig()

  const {
    data: profilePost,
    isValidating: isLoadingPosts,
    mutate: mutatePosts
  } = useSWR([CACHE_KEY_PROFILE_FEED, creatorId], async () => {
    return await feedApi.getFeedForCreator({
      getProfileFeedRequestDto: { creatorId }
    })
  })

  const _createPost = async (values: CreatePostRequestDto) => {
    return await postApi.createPost({
      createPostRequestDto: values
    })
  }

  const createPost = (values: CreatePostRequestDto) => {
    mutate(
      [CACHE_KEY_PROFILE_FEED, creatorId],
      async () => _createPost(values),
      {
        populateCache: async (post, previousPosts) => {
          const { posts } = await feedApi.getFeedForCreator({
            getProfileFeedRequestDto: { creatorId }
          })

          if (!previousPosts) {
            return {
              count: 1,
              cursor: creatorId,
              posts
            }
          } else {
            return {
              count: previousPosts.count + 1,
              cursor: previousPosts.cursor,
              posts
            }
          }
        },
        revalidate: true
      }
    )
  }

  return { profilePost, isLoadingPosts, mutatePosts, createPost }
}

export default useProfileFeed
