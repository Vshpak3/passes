import { PassApi, PayinMethodDto } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
import { usePay } from "../../hooks/usePay"

interface IBuyPassButton {
  passId: string
  payinMethod?: PayinMethodDto
}

export const BuyPassButton = ({ passId, payinMethod }: IBuyPassButton) => {
  const api = wrapApi(PassApi)
  const register = async () => {
    return await api.passRegisterCreatePass({
      createPassHolderRequestDto: {
        passId,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.passRegisterCreatePassData({
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
