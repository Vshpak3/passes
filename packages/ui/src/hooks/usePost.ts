import { PostApi } from "@passes/api-client"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"

const usePost = (postId: string) => {
  const { data: post, isValidating: loading } = useSWR(
    postId ? "/posts" + "/" + postId : null,
    async () => {
      if (!postId) return null
      const api = wrapApi(PostApi)

      return await api.findPost({
        postId: postId
      })
    }
  )

  return { post, loading }
}

export default usePost
