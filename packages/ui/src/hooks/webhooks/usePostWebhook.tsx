import { PostApi, PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
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
        const newPost = data as PostDto & { notification: string }
        const newPosts: Record<string, Partial<PostDto>> = {}
        switch (newPost.notification) {
          case "paying":
          case "failed_payment":
            if (!newPosts[newPost.postId]) {
              newPosts[newPost.postId] = {}
            }
            newPosts[newPost.postId] = {
              paying: newPost.notification === "paying"
            }
            break
          case "paid":
            await sleep("1 second")
            newPosts[newPost.postId] = await api.findPost({
              postId: newPost.postId
            })
            break
          case "processed":
            newPosts[newPost.postId] = { contentProcessed: true }
        }
        setPosts((posts) => {
          return { ...posts, ...newPosts }
        })
      })
      return () => {
        socket.off("post")
      }
    }
  }, [socket])
  return { isConnected, posts, isLogged }
}
