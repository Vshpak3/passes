import { PostApi } from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR from "swr"

export const useSinglePost = (_postId?: string) => {
  const [postId, setPostId] = useState(_postId)

  const api = new PostApi()

  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
  const {
    data: post,
    isValidating: loadingPost,
    mutate
  } = useSWR(postId ? ["/posts/", postId] : null, async () => {
    if (!postId) {
      return
    }
    setHasInitialFetch(true)
    return await api.findPost({
      postId: postId
    })
  })

  // For a brief moment during rendering, loadingPost will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(!!post)

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  return { post, loadingPost, mutate, setPostId, hasInitialFetch }
}
