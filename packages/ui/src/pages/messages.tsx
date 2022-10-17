import dynamic from "next/dynamic"
import { memo, Suspense, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { io } from "socket.io-client"
import { CenterLoader } from "src/components/atoms/CenterLoader"
import { useUser } from "src/hooks/useUser"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
const Messages = dynamic(() => import("src/components/organisms/MessagesV2"), {
  suspense: true,
  ssr: false
})

const MessagesPage = () => {
  const { accessToken } = useUser()
  const socket = io(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/messages/gateway`,
    {
      path: "/api/messages/gateway",
      transports: ["websocket"],
      auth: {
        Authorization: `Bearer ${accessToken}`
      },
      autoConnect: false
    }
  )
  const [isConnected, setIsConnected] = useState(socket.connected)
  // socket.connect()
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("message", "info")
    })
    socket.on("disconnect", () => {
      setIsConnected(false)
    })
    socket.on("message", (data) => {
      toast.success(JSON.stringify(data))
    })
    socket.connect()
    // console.log(socket.connected, "connected")
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      // socket.off('pong');
      socket.disconnect()
    }
  }, [socket])

  return (
    <Suspense fallback={<CenterLoader />}>
      <div className="flex h-screen flex-col">
        <div className="mt-8 ml-5 mb-3 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px]">
          Messages
        </div>
        {isConnected && <Messages />}
      </div>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(MessagesPage), {
  header: false,
  sidebar: true
})
