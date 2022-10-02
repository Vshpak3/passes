import { PassApi, PayinMethodDto } from "@passes/api-client"
import React from "react"
import { usePay } from "src/hooks/usePay"

interface IBuyPassButton {
  passId: string
  payinMethod?: PayinMethodDto
}

export const BuyPassButton = ({ passId, payinMethod }: IBuyPassButton) => {
  const api = new PassApi()
  const register = async () => {
    return await api.registerBuyPass({
      createPassHolderRequestDto: {
        passId,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.registerBuyPassData({
      createPassHolderRequestDto: {
        passId,
        payinMethod
      }
    })
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData
  )

  return (
    <button
      onClick={() => {
        submit()
      }}
      className="w-32 rounded-[50px] bg-passes-pink-100 p-4 text-white"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
