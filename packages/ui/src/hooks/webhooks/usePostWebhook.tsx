import { PostApi, PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { io, Socket } from "socket.io-client"
import { sleep } from "src/helpers/sleep"
import { useUser } from "src/hooks/useUser"
const api = new PostApi()
export const usePostWebhook = () => {
  const { accessToken } = useUser()

  const [posts, setPosts] = useState<Record<string, Partial<PostDto>>>({})

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
      })
      socket.on("disconnect", () => {
        setIsConnected(false)
        setPosts({})
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
    if (socket) {
      socket.on("post", async (data) => {
        let post = data as PostDto & { notification: string }
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (post.notification) {
          case "paid":
            await sleep("1 second")
            post = {
              ...(await api.findPost({
                postId: post.postId
              })),
              ...post
            }
            break
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
