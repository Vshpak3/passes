import { EditPostRequestDto, PostApi, PostDto } from "@passes/api-client"
import { useCallback, useState } from "react"
import { toast } from "react-toastify"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

export const CACHE_KEY_POST = "/posts"

export const usePost = (postId: string) => {
  const api = new PostApi()

  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
  const {
    data: post,
    isValidating: loadingPost,
    mutate: mutatePost
  } = useSWR([CACHE_KEY_POST, postId], async () => {
    setHasInitialFetch(true)
    return await api.findPost({
      postId: postId
    })
  })

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = useCallback(
    (update: Partial<PostDto>) =>
      _mutateManual([CACHE_KEY_POST, postId], update, {
        populateCache: (update: Partial<PostDto>, original: PostDto) => {
          return { ...original, ...update }
        },
        revalidate: false
      }),
    [_mutateManual, postId]
  )

  const editPost = async (editPost: EditPostRequestDto) => {
    try {
      await api.editPost({ editPostRequestDto: editPost })
      toast.success("Post was succesfully edited")
    } catch (error) {
      errorMessage(error)
    }
  }
  // For a brief moment during rendering, loadingPost will be set false
  // before the loading begins. This boolean is needed to handle showing the
  // initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(!!post)

  return {
    post,
    loadingPost,
    mutatePost,
    hasInitialFetch,
    setHasInitialFetch,
    update: mutateManual,
    editPost
  }
}
