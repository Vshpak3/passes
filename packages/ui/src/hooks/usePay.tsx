import detectEthereumProvider from "@metamask/detect-provider"
import {
  PayinDataDto,
  PayinDataDtoBlockedEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  RegisterPayinResponseDto
} from "@passes/api-client"
import { SHA256 } from "crypto-js"
import { useState } from "react"
import { toast } from "react-toastify"
import { errorMessage } from "src/helpers/error"
import { getPhantomProvider } from "src/helpers/payment/payment-wallet"
import {
  connectMetamask,
  EthereumProvider,
  executeMetamaskEthProvider,
  executeMetamaskUSDCProvider,
  setUpPhantomProvider
} from "src/helpers/payment/wallet-setup"
import { accessTokenKey } from "src/helpers/token"

import useLocalStorage from "./useLocalStorage"

export const usePay = (
  registerPaymentFunc: () => Promise<RegisterPayinResponseDto>,
  // for display only, ensure registerPaymentFunc register's a payment of same cost
  registerPaymentDataFunc: () => Promise<PayinDataDto>,
  callback?: (error?: Error) => void
) => {
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState<PayinDataDtoBlockedEnum | undefined>(
    undefined
  )

  const paymentApi = new PaymentApi()
  const [accessToken] = useLocalStorage(accessTokenKey, "")

  const handleCircleCard = async (
    registerResponse: RegisterPayinResponseDto,
    paymentApi: PaymentApi,
    cancelPayinCallback: () => Promise<void>
  ) => {
    try {
      await paymentApi.entryCircleCard({
        circleCardPayinEntryRequestDto: {
          payinId: registerResponse.payinId,
          ip: "",
          sessionId: SHA256(accessToken).toString().substr(0, 50)
        }
      })
    } catch (error: any) {
      await cancelPayinCallback()
      toast.error(error)
      throw error
    }
  }

  const handlePhantomCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const provider = getPhantomProvider()
    if (provider == undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    try {
      setUpPhantomProvider(
        provider,
        paymentApi,
        registerResponse.payinId,
        registerResponse.amount * 10 ** 6,
        cancelPayinCallback
      )
      try {
        await provider.connect()
      } catch (error: any) {
        //display message to user
        await cancelPayinCallback()
        toast.error(error)
        throw error
      }
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
    if (provider == undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(provider)
    } catch (error) {
      //display message to user
      console.error("connection was refused")
      toast.error("connection was refused")
      throw error
    }
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
    if (provider == undefined) {
      //display message to user
      cancelPayinCallback()
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(provider)
    } catch (error) {
      //display message to user
      console.error("connection was refused")
      toast.error("connection was refused")
      throw error
    }
    await executeMetamaskEthProvider(
      account,
      provider,
      paymentApi,
      registerResponse.payinId,
      registerResponse.amount * 10 ** 18,
      cancelPayinCallback
    )
  }

  const submit = async () => {
    setSubmitting(true)
    setLoading(true)
    try {
      const registerResponse = await registerPaymentFunc()
      const cancelPayinCallback = async () => {
        await paymentApi.cancelPayin({
          payinId: registerResponse.payinId
        })
      }
      switch (registerResponse.payinMethod?.method) {
        case PayinMethodDtoMethodEnum.CircleCard:
          await handleCircleCard(
            registerResponse,
            paymentApi,
            cancelPayinCallback
          )
          break
        case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
          await handlePhantomCircleUSDC(registerResponse, cancelPayinCallback)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
          await handleMetamaskCircleUSDC(registerResponse, cancelPayinCallback)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleEth:
          await handleMetamaskCircleEth(registerResponse, cancelPayinCallback)
          break
        default:
          break
      }
      if (callback) {
        callback()
      }
    } catch (error) {
      setSubmitting(false)
      setLoading(false)

      toast.error("Failed to submit payment")

      if (callback) {
        callback()
      }
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  const submitData = async () => {
    const { blocked } = await registerPaymentDataFunc()
    setBlocked(blocked)
  }
  return {
    blocked,
    submitting,
    loading,
    submit,
    submitData
  }
}
