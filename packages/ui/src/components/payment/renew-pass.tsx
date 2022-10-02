import { PassApi, PayinMethodDto } from "@passes/api-client"
import React from "react"
import { usePay } from "src/hooks/usePay"

interface IRenewPassButton {
  passHolderId: string
  payinMethod?: PayinMethodDto
}

export const RenewPassButton = ({
  passHolderId,
  payinMethod
}: IRenewPassButton) => {
  const api = new PassApi()
  const register = async () => {
    return await api.registerRenewPass({
      renewPassHolderRequestDto: {
        passHolderId,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.registerRenewPassData({
      renewPassHolderRequestDto: {
        passHolderId,
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
      className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
