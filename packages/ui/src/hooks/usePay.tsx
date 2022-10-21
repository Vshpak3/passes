import detectEthereumProvider from "@metamask/detect-provider"
import {
  PayinDataDto,
  PayinDataDtoBlockedEnum,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  RegisterPayinResponseDto
} from "@passes/api-client"
import { SHA256 } from "crypto-js"
import ms from "ms"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { errorMessage } from "src/helpers/error"
import { getPhantomProvider } from "src/helpers/payment/payment-wallet"
import {
  connectMetamask,
  EthereumProvider,
  executeMetamaskEthProvider,
  executeMetamaskUSDCProvider,
  executePhantomUSDCProvider
} from "src/helpers/payment/wallet-setup"
import { sleep } from "src/helpers/sleep"
import { accessTokenKey } from "src/helpers/token"

import { useLocalStorage } from "./useLocalStorage"

export const usePay = (
  registerPaymentFunc: () => Promise<RegisterPayinResponseDto>,
  // for display only, ensure registerPaymentFunc register's a payment of same cost
  registerPaymentDataFunc: (amount?: number) => Promise<PayinDataDto>,
  callback?: (error?: Error) => void
) => {
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState<PayinDataDtoBlockedEnum | undefined>(
    undefined
  )
  const paymentApi = new PaymentApi()
  const [accessToken] = useLocalStorage(accessTokenKey, "")
  const [waiting, setWaiting] = useState<Date>()
  const [count, setCount] = useState(0)
  const [payinId, setPayinId] = useState<string>()
  useEffect(() => {
    const fetch = async () => {
      const paymentApi = new PaymentApi()
      await sleep("3 seconds")
      if (waiting && payinId) {
        if (waiting.valueOf() + ms("10 minutes") < Date.now()) {
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
              setWaiting(undefined)
            } else if (
              payin.payinStatus !== PayinDtoPayinStatusEnum.Pending &&
              payin.payinStatus !== PayinDtoPayinStatusEnum.Created &&
              payin.payinStatus !== PayinDtoPayinStatusEnum.ActionRequired
            ) {
              setWaiting(undefined)
              toast.error(
                "Payment failure: an error has occured - please contact support"
              )
            }
          } catch (error: any) {
            setWaiting(undefined)
            errorMessage(error, true)
          }
        } else {
          setWaiting(undefined)
          toast.error("Payment failure: no three d verification link")
        }
      }
      setCount(count + 1)
    }
    fetch()
  }, [count, payinId, waiting])

  const handleCircleCard = async (
    registerResponse: RegisterPayinResponseDto,
    paymentApi: PaymentApi,
    cancelPayinCallback: () => Promise<void>
  ) => {
    try {
      const response = await paymentApi.entryCircleCard({
        circleCardPayinEntryRequestDto: {
          payinId: registerResponse.payinId,
          ip: "",
          sessionId: SHA256(accessToken).toString().substr(0, 50),
          successUrl: window.location.href,
          failureUrl: window.location.href
        }
      })
      if (response.actionRequired) {
        setWaiting(new Date())
      }
    } catch (error: any) {
      await cancelPayinCallback()
      errorMessage(error, true)
    }
  }

  const handlePhantomCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = getPhantomProvider()
    if (provider === undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    try {
      await executePhantomUSDCProvider(
        provider,
        paymentApi,
        registerResponse.payinId,
        registerResponse.amount * 10 ** 6,
        cancelPayinCallback
      )
    } catch (error: any) {
      await cancelPayinCallback()
      throw error
    } finally {
      provider.off("connect")
      provider.off("accountChanged")
      provider.off("disconnect")
    }
  }

  const handleMetamaskCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = (await detectEthereumProvider()) as EthereumProvider
    if (provider === undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    const account = await connectMetamask(provider)
    await executeMetamaskUSDCProvider(
      account,
      provider,
      paymentApi,
      registerResponse.payinId,
      registerResponse.amount * 10 ** 6,
      cancelPayinCallback
    )
  }

  const handleMetamaskCircleEth = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = (await detectEthereumProvider()) as EthereumProvider
    if (provider === undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    if (registerResponse.amountEth === undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("can't purchase with Eth")
    }
    const account = await connectMetamask(provider)
    await executeMetamaskEthProvider(
      account,
      provider,
      paymentApi,
      registerResponse.payinId,
      registerResponse.amountEth,
      cancelPayinCallback
    )
  }

  const submit = async () => {
    if (blocked) {
      return
    }
    setSubmitting(true)
    setLoading(true)
    try {
      const registerResponse = await registerPaymentFunc()
      setPayinId(registerResponse.payinId)
      const cancelPayin = async () => {
        await paymentApi.cancelPayin({
          payinId: registerResponse.payinId
        })
      }
      const uncreatePayin = async () => {
        await paymentApi.uncreatePayin({
          payinId: registerResponse.payinId
        })
      }
      switch (registerResponse.payinMethod?.method) {
        case PayinMethodDtoMethodEnum.CircleCard:
          await handleCircleCard(registerResponse, paymentApi, cancelPayin)
          break
        case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
          await handlePhantomCircleUSDC(registerResponse, uncreatePayin)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
          await handleMetamaskCircleUSDC(registerResponse, uncreatePayin)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleEth:
          await handleMetamaskCircleEth(registerResponse, uncreatePayin)
          break
        default:
          break
      }
      if (callback) {
        callback()
      }
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  const submitData = async (amount?: number) => {
    const { blocked } = await registerPaymentDataFunc(amount)
    setBlocked(blocked)
  }
  return {
    blocked,
    submitting,
    loading,
    submit,
    submitData,
    waiting
  }
}
