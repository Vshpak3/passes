import { CommentApi } from "@passes/api-client"
import useSWR from "swr"

const useComments = (postId: string) => {
  const api = new CommentApi()
  return useSWR(["/comments", postId], () =>
    api.findCommentsForPost({
      getCommentsForPostRequestDto: {
        postId: postId
      }
    })
  )
}

export default useComments
