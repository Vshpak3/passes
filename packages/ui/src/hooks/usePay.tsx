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
import { getPhantomProvider } from "src/helpers/payment/payment-wallet"
import {
  connectMetamask,
  EthereumProvider,
  executeMetamaskEthProvider,
  executeMetamaskUSDCProvider,
  PhantomProvider,
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
  const [amountUSD, setAmountUSD] = useState(0)
  const [phantomProvider, setPhantomProvider] = useState<PhantomProvider>()
  const [metamaskProvider, setMetamaskProvider] = useState<EthereumProvider>()

  const [accessToken] = useLocalStorage(accessTokenKey, "")

  const handleCircleCard = async (
    registerResponse: RegisterPayinResponseDto,
    paymentApi: PaymentApi
  ) => {
    await paymentApi.entryCircleCard({
      circleCardPayinEntryRequestDto: {
        payinId: registerResponse.payinId,
        ip: "",
        sessionId: SHA256(accessToken).toString().substr(0, 50)
      }
    })
  }

  const handlePhantomCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const paymentApi = new PaymentApi()

    if (phantomProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    try {
      setUpPhantomProvider(
        phantomProvider,
        paymentApi,
        registerResponse.payinId,
        registerResponse.amount * 10 ** 6,
        cancelPayinCallback
      )
      try {
        await phantomProvider.connect()
      } catch (error: any) {
        //display message to user
        await cancelPayinCallback()
        toast.error(error)
        throw error
      }
    } finally {
      phantomProvider.off("connect")
      phantomProvider.off("accountChanged")
      phantomProvider.off("disconnect")
    }
  }

  const handleMetamaskCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    const paymentApi = new PaymentApi()

    if (metamaskProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(metamaskProvider)
    } catch (error) {
      //display message to user
      console.error("connection was refused")
      toast.error("connection was refused")
      throw error
    }
    await executeMetamaskUSDCProvider(
      account,
      metamaskProvider,
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
    const paymentApi = new PaymentApi()

    if (metamaskProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(metamaskProvider)
    } catch (error) {
      //display message to user
      console.error("connection was refused")
      toast.error("connection was refused")
      throw error
    }
    await executeMetamaskEthProvider(
      account,
      metamaskProvider,
      paymentApi,
      registerResponse.payinId,
      registerResponse.amount * 10 ** 18,
      cancelPayinCallback
    )
  }

  const submit = async () => {
    setSubmitting(true)
    setLoading(true)
    const paymentApi = new PaymentApi()
    try {
      const registerResponse = await registerPaymentFunc()
      const cancelPayinCallback = async () => {
        await paymentApi.cancelPayin({
          payinId: registerResponse.payinId
        })
      }
      if (
        registerResponse.amount !== undefined &&
        registerResponse.amount !== amountUSD
      ) {
        const error = new Error("sanity check: amounts don't matchup")
        if (callback) {
          callback(error)
        }

        console.error(error)
      }
      switch (registerResponse.payinMethod?.method) {
        case PayinMethodDtoMethodEnum.CircleCard:
          await handleCircleCard(registerResponse, paymentApi)
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

      if (callback) {
        callback()
      }
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }

  const submitData = async () => {
    if (phantomProvider === undefined) {
      const provider = getPhantomProvider()
      if (provider !== undefined) {
        setPhantomProvider(provider)
      }
    }
    // const fetchData = async () => {
    if (metamaskProvider === undefined) {
      const provider = await detectEthereumProvider()
      if (provider !== undefined) {
        setMetamaskProvider(provider as EthereumProvider)
      }
    }

    const { amount, blocked } = await registerPaymentDataFunc()
    setAmountUSD(amount)
    setBlocked(blocked)
    // }
    // fetchData()
  }
  // TODO: Patrick ; registerPaymentDataFunc() is called on every render and we
  //  submit too many times the message, by removing registerPaymentDataFunc fixes for me but it may lead to other problems, please check this
  return { blocked, amountUSD, submitting, loading, submit, submitData }
}
