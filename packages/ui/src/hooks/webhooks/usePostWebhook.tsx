import { PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { io, Socket } from "socket.io-client"
import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { useUser } from "src/hooks/useUser"
export const MAX_ATTEMPTS = 5
export const usePostWebhook = () => {
  const { accessToken } = useUser()

  const [posts, setPosts] = useState<Record<string, Partial<PostDto>>>({})
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
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (post.notification) {
          case "failed_payment":
            toast.error("Payment for post failed")
            break
        }
        setPosts((posts) => {
          return { ...posts, ...{ [post.postId]: post } }
        })
      })
      return () => {
        socket.off("post")
      }
    }
  }, [socket])
  return { isConnected, posts, isLogged }
}
