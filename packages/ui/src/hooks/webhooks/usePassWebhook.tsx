import { PassHolderDto, PostDto } from "@passes/api-client"
import { useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { useSWRConfig } from "swr"

import { CACHE_KEY_PASS, PassWithStatusDto } from "src/hooks/entities/usePass"
import { useWebhook } from "./useWebhook"

export const usePassWebhook = () => {
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

  const { socket, isConnected, isLogged } = useWebhook("/api/pass/gateway")
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
        socket.off("pass")
      }
    }
  }, [mutateManual, socket])
  return { isConnected, isLogged }
}
