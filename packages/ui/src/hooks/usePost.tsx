import { PostApi } from "@passes/api-client"
import { useEffect } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"

export const usePost = (postId: string) => {
  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
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

  useEffect(() => {
    if (post === undefined) {
      mutate()
    }
  }, [mutate, post])

  return { post, loading, mutate, removePost }
}
