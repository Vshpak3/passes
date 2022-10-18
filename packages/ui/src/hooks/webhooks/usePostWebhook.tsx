import { PostApi, PostDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { sleep } from "src/helpers/sleep"
import { useUser } from "src/hooks/useUser"

export const usePostWebhook = () => {
  const { accessToken } = useUser()
  const api = new PostApi()
  const [posts, setPosts] = useState<Record<string, Partial<PostDto>>>({})
  const socket = io(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/gateway`,
    {
      path: "/api/post/gateway",
      transports: ["websocket"],
      auth: {
        Authorization: `Bearer ${accessToken}`
      },
      autoConnect: false
    }
  )
  const [isConnected, setIsConnected] = useState(socket.connected)
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("message", "info")
    })
    socket.on("disconnect", () => {
      setIsConnected(false)
      setPosts({})
    })
    socket.on("post", async (data) => {
      const newPost = data as PostDto & { notification: string }
      const newMap = { ...posts }
      switch (newPost.notification) {
        case "paying":
        case "failed_payment":
          if (!newMap[newPost.postId]) {
            newMap[newPost.postId] = {}
          }
          newMap[newPost.postId] = { paying: newPost.notification === "paying" }
          break
        case "paid":
          await sleep("1 second")
          newMap[newPost.postId] = await api.findPost({
            postId: newPost.postId
          })
          break
      }
    })
    socket.connect()
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("post")
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])
  return { isConnected, posts }
}
