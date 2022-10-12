import { PostApi } from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"

export const usePost = (postId: string) => {
  const api = new PostApi()

  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
  const {
    data: post,
    isValidating: loading,
    mutate
  } = useSWR(postId ? "/posts" + "/" + postId : null, async () => {
    if (!postId) {
      return null
    }
    setHasInitialFetch(true)
    return await api.findPost({
      postId: postId
    })
  })

  // For a brief moment during rendering, loadingProfileInfo will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(!!post)

  const removePost = async (postId: string) => {
    const api = new PostApi()
    await api.removePost({ postId }).catch((error) => toast(error))
  }

  useEffect(() => {
    if (post === undefined) {
      mutate()
    }
  }, [mutate, post])

  return { post, loading, mutate, hasInitialFetch, removePost }
}
