import { useEffect } from "react"
import { toast } from "react-toastify"

import { useWebhook } from "./useWebhook"

export const usePaymentWebhook = () => {
  const { socket, isConnected, isLogged } = useWebhook("/api/payment/gateway")
  useEffect(() => {
    if (socket) {
      socket.on("payment", async (data) => {
        const { notification } = data
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (notification) {
          case "failed_payment":
            toast.error(
              "Your card payment was declined, please check with your bank"
            )
            break
        }
      })
      return () => {
        socket.off("payment")
      }
    }
  }, [socket])
  return { isConnected, isLogged }
}
