import { PayinDataDto, PayinMethodDto, PostApi } from "@passes/api-client"
import React from "react"

import { usePay } from "../../hooks/usePay"

interface ITipPostButton {
  postId: string
  amount: number
  payinMethod?: PayinMethodDto
  onClick: (submit: () => Promise<void>) => void
  onCompleted?: () => void
}

export const TipPostButton = ({
  postId,
  amount,
  payinMethod,
  onClick,
  onCompleted
}: ITipPostButton) => {
  const api = new PostApi()
  const register = async () => {
    const response = await api.registerTipPost({
      tipPostRequestDto: {
        postId,
        amount,
        payinMethod
      }
    })

    onCompleted && onCompleted()

    return response
  }

  const registerData = async () => {
    return { blocked: undefined, amount } as PayinDataDto
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData
  )

  return (
    <button
      onClick={() => {
        onClick(submit)
      }}
      className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
