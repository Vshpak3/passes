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
    return await api.postRegisterPurchasePost({
      createPostAccessRequestDto: {
        postId,
        fromDM,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.postRegisterPurchasePostData({
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
      className="w-32 rounded-[50px] bg-[#C943A8] p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
