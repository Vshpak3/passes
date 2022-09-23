import { PayinMethodDto, PostApi } from "@passes/api-client"
import React from "react"

import { usePay } from "../../hooks/usePay"

interface IBuyPostButton {
  postId: string
  fromDM: boolean
  payinMethod?: PayinMethodDto
  onSuccess: () => void
}

export const BuyPostButton = ({
  postId,
  payinMethod,
  onSuccess
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
      className="mt-2 w-32 rounded-[50px] bg-passes-pink-100 p-2 text-white"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "Loading" : buttonText}
    </button>
  )
}
