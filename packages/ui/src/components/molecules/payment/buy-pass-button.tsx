import { PassApi, PayinMethodDto } from "@passes/api-client"
import classNames from "classnames"
import React from "react"
import { usePay } from "src/hooks/usePay"

interface IBuyPassButton {
  passId: string
  payinMethod?: PayinMethodDto
  onSuccess: () => void
  isDisabled?: boolean
}

export const BuyPassButton = ({
  passId,
  payinMethod,
  onSuccess,
  isDisabled = false
}: IBuyPassButton) => {
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

  const { blocked, submitting, loading, submit } = usePay(
    register,
    registerData,
    onSuccess
  )

  return (
    <button
      onClick={submit}
      className={classNames(
        isDisabled
          ? "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white"
      )}
      type="submit"
      {...(blocked || submitting ? { disabled: isDisabled || true } : {})}
    >
      {loading ? "Loading" : "Buy pass"}
    </button>
  )
}
