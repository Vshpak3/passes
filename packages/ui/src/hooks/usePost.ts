import { PostApi } from "@passes/api-client"
import useSWR from "swr"

const usePost = (postId: string) => {
  const { data: post, isValidating: loading } = useSWR(
    postId ? "/posts" + "/" + postId : null,
    async () => {
      if (!postId) {
        return null
      }
      const api = new PostApi()

      return await api.findPost({
        postId: postId
      })
    }
  )

  return { post, loading }
}

export default usePost
