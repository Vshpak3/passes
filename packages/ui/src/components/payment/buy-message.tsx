import { MessagesApi, PayinMethodDto } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
import { usePay } from "../../hooks/usePay"

interface IBuyMessageButton {
  messageId: string
  payinMethod?: PayinMethodDto
  onSuccess: () => void
}

export const BuyMessageButton = ({
  messageId,
  payinMethod,
  onSuccess
}: IBuyMessageButton) => {
  const api = wrapApi(MessagesApi)
  const register = async () => {
    return await api.registerPurchaseMessage({
      purchaseMessageRequestDto: {
        messageId,
        payinMethod
      }
    })
  }
  const registerData = async () => {
    return await api.registerPurchaseMessageData({
      purchaseMessageRequestDto: {
        messageId,
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
