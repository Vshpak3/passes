import { PostDto } from "@passes/api-client"
import { useCallback, useEffect } from "react"
import { useSWRConfig } from "swr"

import { CACHE_KEY_POST } from "src/hooks/entities/usePost"
import { useWebhook } from "./useWebhook"

export const usePostWebhook = () => {
  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = useCallback(
    (update: Partial<PostDto>, postId: string) =>
      _mutateManual([CACHE_KEY_POST, postId], update, {
        populateCache: (
          update: Partial<PostDto>,
          original: PostDto | undefined
        ) => {
          return { ...original, ...update }
        },
        revalidate: false
      }),
    [_mutateManual]
  )
  const { socket, isConnected, isLogged } = useWebhook("/api/post/gateway")

  useEffect(() => {
    if (socket) {
      socket.on("post", async (data) => {
        const post = data as PostDto & { notification: string }
        if (data.paidAt) {
          data.paidAt = new Date(data.paidAt)
        }
        mutateManual(post, post.postId)
      })
      return () => {
        socket.off("post")
      }
    }
  }, [mutateManual, socket])
  return { isConnected, isLogged }
}
