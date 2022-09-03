import { PayinMethodDto, PostApi } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
import { usePay } from "../../hooks/usePay"

interface IBuyPostButton {
  postId: string
  fromDM: boolean
  payinMethod?: PayinMethodDto
}

export const BuyPostButton = ({
  postId,
  fromDM,
  payinMethod
}: IBuyPostButton) => {
  const api = wrapApi(PostApi)
  const register = async () => {
    return await api.registerPurchasePost({
      createPostAccessRequestDto: {
        postId,
        fromDM,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.registerPurchasePostData({
      createPostAccessRequestDto: {
        postId,
        fromDM,
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
      className="mt-2 w-32 rounded-[50px] bg-passes-pink-100 p-2 text-white"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "Buy Post" : `Pay ${amountUSD}`}
    </button>
  )
}
