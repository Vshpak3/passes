import { PayinDataDto, PayinMethodDto, PostApi } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
import { usePay } from "../../hooks/usePay"

interface ITipPostButton {
  postId: string
  amount: number
  payinMethod?: PayinMethodDto
}

export const BuyPassButton = ({
  postId,
  amount,
  payinMethod
}: ITipPostButton) => {
  const api = wrapApi(PostApi)
  const register = async () => {
    return await api.postRegisterTipPost({
      tipPostRequestDto: {
        postId,
        amount,
        payinMethod
      }
    })
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
        submit()
      }}
      className="w-32 rounded-[50px] bg-[#C943A8] p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
