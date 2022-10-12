import { PostApi } from "@passes/api-client"
import useSWR from "swr"

export const CACHE_KEY_SCHEDULED_EVENTS = "/posts/scheduled"

const postAPI = new PostApi()

export const useScheduledPosts = () => {
  return useSWR(
    CACHE_KEY_SCHEDULED_EVENTS,
    () =>
      postAPI
        .getPosts({
          getPostsRequestDto: {
            scheduledOnly: true
          }
        })
        .then(({ data }) => {
          return data
        }),
    { revalidateOnMount: true }
  )
}
