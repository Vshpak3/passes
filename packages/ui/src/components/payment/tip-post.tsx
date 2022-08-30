import { PayinDataDto, PayinMethodDto, PostApi } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
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
  const api = wrapApi(PostApi)
  const register = async () => {
    const response = await api.postRegisterTipPost({
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
    return { blocked: false, amount } as PayinDataDto
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
      className="w-32 rounded-[50px] bg-[#C943A8] p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
