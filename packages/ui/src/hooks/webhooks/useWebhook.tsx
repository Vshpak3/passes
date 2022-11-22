import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { useUser } from "src/hooks/useUser"

// For authenticated webhooks
export const useWebhook = (path: string) => {
  const { accessToken } = useUser()

  const [attempts, setAttempts] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    setSocket(
      accessToken && accessToken.length
        ? io(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
            path,
            transports: ["websocket"],
            auth: {
              Authorization: `Bearer ${accessToken}`
            },
            autoConnect: false
          })
        : undefined
    )
    setIsLogged(!!accessToken && !!accessToken.length)
  }, [accessToken, path])
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

  return {
    attempts,
    setAttempts,
    isConnected,
    setIsConnected,
    isLogged,
    setIsLogged,
    socket,
    setSocket
  }
}
