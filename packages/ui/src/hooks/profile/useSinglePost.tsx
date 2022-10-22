import { PostApi } from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR from "swr"

const CACHE_KEY_POST = "/posts"

export const useSinglePost = (_postId?: string) => {
  const [postId, setPostId] = useState(_postId)

  const api = new PostApi()

  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
  const {
    data: post,
    isValidating: loadingPost,
    mutate: mutatePost
  } = useSWR(postId ? [CACHE_KEY_POST, postId] : null, async () => {
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
    mutatePost()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  return { post, loadingPost, mutatePost, setPostId, hasInitialFetch }
}
