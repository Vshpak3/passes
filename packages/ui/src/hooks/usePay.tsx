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
import { useLocalStorage } from "./storage/useLocalStorage"

export const usePay = (
  registerPaymentFunc: () => Promise<RegisterPayinResponseDto>,
  // for display only, ensure registerPaymentFunc register's a payment of same cost
  registerPaymentDataFunc: (amount?: number) => Promise<PayinDataDto>,
  callback?: (error?: Error) => void,
  landingMessage = "none"
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
              toast.success("Your card payment was successful!")
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
          } catch (error: unknown) {
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

  const checkProvider = async (
    provider: any,
    cancelPayinCallback: () => Promise<void>
  ) => {
    if (provider === undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
  }

  const toastPleaseWait = () => {
    toast.info("Please wait as we confirm the transaction.")
  }

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
          successUrl:
            window.location.origin +
            window.location.pathname +
            "?r=success&lm=" +
            landingMessage,
          failureUrl:
            window.location.origin +
            window.location.pathname +
            "?r=failure&lm=" +
            landingMessage
        }
      })
      if (response.actionRequired) {
        toast.info("Please wait as we redirect you.")
        setWaiting(new Date())
      } else {
        toast.success(
          "We have recieved your card payment. Please wait as we process it!"
        )
      }
    } catch (error: unknown) {
      await cancelPayinCallback()
      errorMessage(error, true)
    }
  }

  const handlePhantomCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = getPhantomProvider()
    await checkProvider(provider, cancelPayinCallback)
    try {
      await executePhantomUSDCProvider(
        provider,
        paymentApi,
        registerResponse.payinId,
        registerResponse.amount * 10 ** 6,
        cancelPayinCallback
      )
    } catch (error: unknown) {
      await cancelPayinCallback()
      throw error
    } finally {
      provider.off("connect")
      provider.off("accountChanged")
      provider.off("disconnect")
    }
    toastPleaseWait()
  }

  const handleMetamaskCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = (await detectEthereumProvider()) as EthereumProvider
    await checkProvider(provider, cancelPayinCallback)
    const account = await connectMetamask(provider)
    await executeMetamaskUSDCProvider(
      account,
      provider,
      paymentApi,
      registerResponse.payinId,
      registerResponse.amount * 10 ** 6,
      cancelPayinCallback
    )
    toastPleaseWait()
  }

  const handleMetamaskCircleEth = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = (await detectEthereumProvider()) as EthereumProvider
    await checkProvider(provider, cancelPayinCallback)
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
    toastPleaseWait()
  }

  const submit = async () => {
    if (blocked) {
      return
    }
    setSubmitting(true)
    setLoading(true)
    let checkFunding = false
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
          checkFunding = true
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
          await handleMetamaskCircleUSDC(registerResponse, uncreatePayin)
          checkFunding = true
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleEth:
          await handleMetamaskCircleEth(registerResponse, uncreatePayin)
          checkFunding = true
          break
        default:
          break
      }
      if (callback) {
        callback()
      }
    } catch (error: unknown) {
      errorMessage(error, true)
      if (checkFunding) {
        errorMessage(
          "If paying with crypto, please check for sufficient funding",
          true
        )
      }
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
