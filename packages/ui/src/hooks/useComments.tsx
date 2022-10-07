import { CommentApi } from "@passes/api-client"
import useSWR from "swr"

const CACHE_KEY_COMMENT = "/profile/comments/post/"

const useComments = (postId: string) => {
  const api = new CommentApi()
  return useSWR([CACHE_KEY_COMMENT, postId], () =>
    api.findCommentsForPost({
      getCommentsForPostRequestDto: {
        postId: postId
      }
    })
  )
}

export default useComments
