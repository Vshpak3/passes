import { PayinMethodDto, PostApi } from "@passes/api-client"
import classNames from "classnames"
import React from "react"

import { usePay } from "../../hooks/usePay"

interface IBuyPostButton {
  postId: string
  fromDM: boolean
  onSuccess: () => void
  payinMethod?: PayinMethodDto
  isDisabled?: boolean
}

export const BuyPostButton = ({
  postId,
  payinMethod,
  onSuccess,
  isDisabled = false
}: IBuyPostButton) => {
  const api = new PostApi()
  const register = async () => {
    return await api.registerPurchasePost({
      purchasePostRequestDto: {
        postId,
        payinMethod
      }
    })
  }
  const registerData = async () => {
    return await api.registerPurchasePostData({
      purchasePostRequestDto: {
        postId,
        payinMethod
      }
    })
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData,
    onSuccess
  )

  const buttonText = amountUSD > 0 ? `Pay ${amountUSD}` : "Buy post"

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
      {loading ? "Loading" : buttonText}
    </button>
  )
}
