import { PassHolderDto, PostDto } from "@passes/api-client"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { io, Socket } from "socket.io-client"
import { useSWRConfig } from "swr"

import {
  MAX_RECONNECT_ATTEMPTS,
  TIME_BETWEEN_RECONNECTS
} from "src/config/webhooks"
import { CACHE_KEY_PASS, PassWithStatusDto } from "src/hooks/entities/usePass"
import { useUser } from "src/hooks/useUser"

export const usePassWebhook = () => {
  const { accessToken } = useUser()

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = useCallback(
    (update: Partial<PassWithStatusDto>, passId: string) =>
      _mutateManual([CACHE_KEY_PASS, passId], update, {
        populateCache: (
          update: Partial<PassWithStatusDto>,
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
        ? io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pass/gateway`, {
            path: "/api/pass/gateway",
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
      socket.on("pass", async (data) => {
        const passHolding = data as PassHolderDto & { notification: string }
        const update: Partial<PassWithStatusDto> = {}
        switch (passHolding.notification) {
          case "paying":
            update.paying = true
            break
          case "failed_payment":
            update.paying = false
            break
          case "paid":
            update.paying = false
            toast.success("Membership purchase completed")
            break
        }
        mutateManual(update, passHolding.passId)
      })
      return () => {
        socket.off("post")
      }
    }
  }, [mutateManual, socket])
  return { isConnected, isLogged }
}
