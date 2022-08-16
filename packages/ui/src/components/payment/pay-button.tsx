import detectEthereumProvider from "@metamask/detect-provider"
import {
  PayinDataDto,
  PaymentApi,
  RegisterPayinResponseDto,
  RegisterPayinResponseDtoMethodEnum
} from "@passes/api-client"
import { SHA256 } from "crypto-js"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

import useLocalStorage from "../../hooks/useLocalStorage"
import useUser from "../../hooks/useUser"
import { getPhantomProvider } from "./payment-wallet"
import {
  connectMetamask,
  EthereumProvider,
  executeMetamaskEthProvider,
  executeMetamaskUSDCProvider,
  PhantomProvider,
  setUpPhantomProvider
} from "./wallet-setup"

export const PayButton = (
  registerPaymentFunc: () => Promise<RegisterPayinResponseDto>,
  // for display only, ensure registerPaymentFunc register's a payment of same cost
  registerPaymentDataFunc: () => Promise<PayinDataDto>
) => {
  const [submitting, setSubmitting] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [amountUSD, setAmountUSD] = useState(0)
  const [phantomProvider, setPhantomProvider] = useState<PhantomProvider>()
  const [metamaskProvider, setMetamaskProvider] = useState<EthereumProvider>()
  const [paymentApi] = useState<PaymentApi>(new PaymentApi())

  const { user, loading } = useUser()
  const router = useRouter()
  const [accessToken] = useLocalStorage("access-token", "")

  const handleCircleCard = async (
    registerResponse: RegisterPayinResponseDto,
    paymentApi: PaymentApi
  ) => {
    await paymentApi.paymentEntryCircleCard(
      {
        circleCardPayinEntryRequestDto: {
          payinId: registerResponse.payinId,
          ip: "",
          sessionId: SHA256(accessToken).toString().substr(0, 50)
        }
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      }
    )
  }

  const handlePhantomCircleUSDC = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    if (phantomProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    try {
      setUpPhantomProvider(
        phantomProvider,
        paymentApi,
        registerResponse.payinId,
        accessToken,
        registerResponse.amount * 10 ** 6,
        cancelPayinCallback
      )
      try {
        await phantomProvider.connect()
      } catch (error) {
        //display message to user
        await cancelPayinCallback()
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
    if (metamaskProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(metamaskProvider)
    } catch (error) {
      //display message to user
      console.log("connection was refused")
      throw error
    }
    await executeMetamaskUSDCProvider(
      account,
      metamaskProvider,
      paymentApi,
      registerResponse.payinId,
      accessToken,
      registerResponse.amount * 10 ** 6,
      cancelPayinCallback
    )
  }

  const handleMetamaskCircleEth = async (
    registerResponse: RegisterPayinResponseDto,
    cancelPayinCallback: () => Promise<void>
  ) => {
    if (metamaskProvider == undefined) {
      //display message to user
      throw new Error("no provider exists")
    }
    let account = ""
    try {
      account = await connectMetamask(metamaskProvider)
    } catch (error) {
      //display message to user
      console.log("connection was refused")
      throw error
    }
    await executeMetamaskEthProvider(
      account,
      metamaskProvider,
      paymentApi,
      registerResponse.payinId,
      accessToken,
      registerResponse.amount * 10 ** 18,
      cancelPayinCallback
    )
  }

  const submit = async () => {
    setSubmitting(true)
    const paymentApi = new PaymentApi()
    try {
      const registerResponse = await registerPaymentFunc()
      const cancelPayinCallback = async () => {
        await paymentApi.paymentCancelPayin(
          { payinId: registerResponse.payinId },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          }
        )
      }
      if (registerResponse.amount !== amountUSD) {
        throw Error("sanity check: amounts don't matchup")
      }
      switch (registerResponse.method) {
        case RegisterPayinResponseDtoMethodEnum.CircleCard:
          await handleCircleCard(registerResponse, paymentApi)
          break
        case RegisterPayinResponseDtoMethodEnum.PhantomCircleUsdc:
          await handlePhantomCircleUSDC(registerResponse, cancelPayinCallback)
          break
        case RegisterPayinResponseDtoMethodEnum.MetamaskCircleUsdc:
          await handleMetamaskCircleUSDC(registerResponse, cancelPayinCallback)
          break
        case RegisterPayinResponseDtoMethodEnum.MetamaskCircleEth:
          await handleMetamaskCircleEth(registerResponse, cancelPayinCallback)
          break
      }
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (phantomProvider === undefined) {
      const provider = getPhantomProvider()
      if (provider !== undefined) {
        setPhantomProvider(provider)
      }
    }
    const fetchData = async () => {
      if (metamaskProvider === undefined) {
        const provider = await detectEthereumProvider()
        if (provider !== undefined) {
          setMetamaskProvider(provider as EthereumProvider)
        }
      }

      const { amount, blocked } = await registerPaymentDataFunc()
      setAmountUSD(amount)
      setBlocked(blocked)
    }
    fetchData()
  }, [
    router,
    user,
    loading,
    phantomProvider,
    metamaskProvider,
    registerPaymentDataFunc
  ])

  return (
    <button
      onClick={() => {
        submit()
      }}
      className="w-32 rounded-[50px] bg-[#C943A8] p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      Pay ${amountUSD}
    </button>
  )
}
