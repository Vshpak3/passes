import { PostDto } from "@passes/api-client"
import { useCallback, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useSWRConfig } from "swr"

import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { CACHE_KEY_POST } from "src/hooks/entities/usePost"
import { useUser } from "src/hooks/useUser"

export const usePostWebhook = () => {
  const { accessToken } = useUser()

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

  const [attempts, setAttempts] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    setSocket(
      accessToken && accessToken.length
        ? io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/gateway`, {
            path: "/api/post/gateway",
            transports: ["websocket"],
            auth: {
              Authorization: `Bearer ${accessToken}`
            },
            autoConnect: false
          })
        : undefined
    )
    setIsLogged(!!accessToken && !!accessToken.length)
  }, [accessToken])
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true)
        setAttempts(0)
      })
      socket.on("disconnect", () => {
        setIsConnected(false)
      })
      socket.connect()
      return () => {
        socket.off("connect")
        socket.off("disconnect")
        socket.disconnect()
      }
    }
  }, [socket])
  useEffect(() => {
    if (!isConnected && attempts < MAX_RECONNECT_ATTEMPTS) {
      const interval = setTimeout(async () => {
        socket?.connect()
        setAttempts(attempts + 1)
      }, TIME_BETWEEN_RECONNECTS)
      return () => clearInterval(interval)
    }
  }, [isConnected, attempts, socket])
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
