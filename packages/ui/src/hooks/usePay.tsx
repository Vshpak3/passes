import detectEthereumProvider from "@metamask/detect-provider"
import {
  PayinDataDto,
  PayinDataDtoBlockedEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  RegisterPayinResponseDto
} from "@passes/api-client"
import { SHA256 } from "crypto-js"
import { useCallback, useContext, useState } from "react"
import { toast } from "react-toastify"

import { ThreeDSContext } from "src/contexts/ThreeDS"
import {
  detectSolanaProvider,
  EthereumProvider,
  PhantomProvider
} from "src/helpers/crypto/types"
import { errorMessage, HasMessage } from "src/helpers/error"
import {
  connectMetamask,
  executeMetamaskEthProvider,
  executeMetamaskUSDCProvider,
  executePhantomUSDCProvider
} from "src/helpers/payment/wallet-setup"
import { accessTokenKey } from "src/helpers/token"
import { useLocalStorage } from "./storage/useLocalStorage"

const paymentApi = new PaymentApi()

export const usePay = (
  registerPaymentFunc: () => Promise<RegisterPayinResponseDto>,
  // for display only, ensure registerPaymentFunc register's a payment of same cost
  registerPaymentDataFunc: (amount?: number) => Promise<PayinDataDto>,
  callback?: (error?: Error) => void,
  landingMessage = "none"
) => {
  const [submitting, setSubmitting] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState<PayinDataDtoBlockedEnum | undefined>(
    undefined
  )

  const [accessToken] = useLocalStorage(accessTokenKey, "")
  const [waiting, setWaiting] = useState<boolean>()
  const { setPayin } = useContext(ThreeDSContext)

  const checkProvider = async (
    provider: PhantomProvider | EthereumProvider | undefined | null,
    cancelPayinCallback: () => Promise<void>
  ) => {
    if (!provider) {
      //display message to user
      cancelPayinCallback()
      throw new Error("Wallet provider does not exist")
    }
  }

  const toastPleaseWait = () => {
    toast.info("Please wait as we confirm the transaction.")
  }

  const handleCircleCard = useCallback(
    async (
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
          setPayin(registerResponse.payinId ?? null)
          setRedirecting(true)
          return false
        } else {
          toast.success(
            "We have recieved your card payment. Please wait as we process it!"
          )
        }
      } catch (error: unknown) {
        await cancelPayinCallback()
        errorMessage(error, true)
      }
      return true
    },
    [accessToken, landingMessage, setPayin]
  )

  const handlePhantomCircleUSDC = useCallback(
    async (
      registerResponse: RegisterPayinResponseDto,
      cancelPayinCallback: () => Promise<void>
    ) => {
      const provider = detectSolanaProvider({}) as PhantomProvider
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
      return true
    },
    []
  )

  const handleMetamaskCircleUSDC = useCallback(
    async (
      registerResponse: RegisterPayinResponseDto,
      cancelPayinCallback: () => Promise<void>
    ) => {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: true
      })) as EthereumProvider
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
      return true
    },
    []
  )

  const handleMetamaskCircleEth = useCallback(
    async (
      registerResponse: RegisterPayinResponseDto,
      cancelPayinCallback: () => Promise<void>
    ) => {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: true
      })) as EthereumProvider
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
      return true
    },
    []
  )

  const submit = useCallback(async () => {
    if (blocked) {
      return
    }
    setSubmitting(true)
    setLoading(true)
    let checkFunding = false
    try {
      const registerResponse = await registerPaymentFunc()
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
      let res = true
      switch (registerResponse.payinMethod?.method) {
        case PayinMethodDtoMethodEnum.CircleCard:
          res = await handleCircleCard(
            registerResponse,
            paymentApi,
            cancelPayin
          )
          break
        case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
          checkFunding = true
          res = await handlePhantomCircleUSDC(registerResponse, uncreatePayin)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
          res = await handleMetamaskCircleUSDC(registerResponse, uncreatePayin)
          break
        case PayinMethodDtoMethodEnum.MetamaskCircleEth:
          res = await handleMetamaskCircleEth(registerResponse, uncreatePayin)
          break
        default:
          break
      }
      if (res) {
        if (callback) {
          callback()
        }
      } else {
        setWaiting(true)
      }
    } catch (error: unknown | HasMessage) {
      if ((error as HasMessage).message) {
        errorMessage(new Error((error as HasMessage).message), true)
      } else {
        errorMessage(error, true)
      }
      if (checkFunding) {
        errorMessage(
          new Error(
            "When paying with crypto, please check for sufficient funding"
          ),
          true
        )
      }
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }, [
    blocked,
    callback,
    handleCircleCard,
    handleMetamaskCircleEth,
    handleMetamaskCircleUSDC,
    handlePhantomCircleUSDC,
    registerPaymentFunc
  ])

  const submitData = async (amount?: number) => {
    const { blocked } = await registerPaymentDataFunc(amount)
    setBlocked(blocked)
  }
  return {
    blocked,
    submitting: submitting || redirecting,
    loading,
    submit,
    submitData,
    waiting
  }
}
