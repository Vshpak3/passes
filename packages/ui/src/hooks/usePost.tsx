import { PostApi } from "@passes/api-client"
import { toast } from "react-toastify"
import useSWR from "swr"

const usePost = (postId?: string) => {
  const {
    data: post,
    isValidating: loading,
    mutate
  } = useSWR(postId ? "/posts" + "/" + postId : null, async () => {
    if (!postId) {
      return null
    }
    const api = new PostApi()

    return await api.findPost({
      postId: postId
    })
  })

  const removePost = async (postId: string) => {
    const api = new PostApi()
    await api.removePost({ postId }).catch((error) => toast(error))
  }

  return { post, loading, mutate, removePost }
}

export default usePost
