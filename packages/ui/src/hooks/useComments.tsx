import { CommentApi } from "@passes/api-client"
import useSWR from "swr"

const CACHE_KEY_COMMENT = "/profile/comments/post/"

export const useComments = (postId: string) => {
  const api = new CommentApi()
  return useSWR([CACHE_KEY_COMMENT, postId], () =>
    api.findCommentsForPost({
      getCommentsForPostRequestDto: {
        postId: postId
      }
    })
  )
}
