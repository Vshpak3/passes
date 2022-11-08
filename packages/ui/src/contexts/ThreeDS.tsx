import { PayinDtoPayinStatusEnum, PaymentApi } from "@passes/api-client"
import ms from "ms"
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { errorMessage } from "src/helpers/error"

interface ThreeDSContextProps {
  readonly setPayin: (payinId: string | null) => void
}

export const ThreeDSContext = createContext<ThreeDSContextProps>(
  {} as ThreeDSContextProps
)

const THREE_DS_EXPIRATION_TIME = "10 minutes"
const THREE_DS_WAITING_TIME = "1 second"

export const useThreeDS = () => {
  const [waiting, setWaiting] = useState<Date>()
  const [count, setCount] = useState(0)
  const [payinId, setPayinId] = useState<string>()

  const setPayin = (payinId: string) => {
    setPayinId(payinId)
    setWaiting(new Date())
  }
  const clear = () => {
    setWaiting(undefined)
    setPayinId(undefined)
  }
  useEffect(() => {
    if (payinId && waiting) {
      const fetch = async () => {
        const paymentApi = new PaymentApi()
        if (waiting.valueOf() + ms(THREE_DS_EXPIRATION_TIME) > Date.now()) {
          try {
            const payin = await paymentApi.getPayin({
              getPayinRequestDto: { payinId }
            })
            if (payin.redirectUrl) {
              window.location.href = payin.redirectUrl
            } else if (
              payin.payinStatus === PayinDtoPayinStatusEnum.Successful ||
              payin.payinStatus === PayinDtoPayinStatusEnum.SuccessfulReady
            ) {
              clear()
              toast.success("Your card payment was successful!")
            } else if (
              payin.payinStatus !== PayinDtoPayinStatusEnum.Pending &&
              payin.payinStatus !== PayinDtoPayinStatusEnum.Created &&
              payin.payinStatus !== PayinDtoPayinStatusEnum.CreatedReady &&
              payin.payinStatus !== PayinDtoPayinStatusEnum.ActionRequired
            ) {
              clear()
              toast.error(
                "Payment failure: an error has occured - please contact support"
              )
            }
          } catch (error: unknown) {
            clear()
            errorMessage(error, true)
          }
        } else {
          clear()
          toast.error(
            `Payment failure: no three d verification link after ${THREE_DS_EXPIRATION_TIME}`
          )
        }
        setCount(count + 1)
      }
      const interval = setTimeout(() => fetch, ms(THREE_DS_WAITING_TIME))
      return () => clearInterval(interval)
    }
  }, [count, payinId, waiting])

  return { setPayin }
}
