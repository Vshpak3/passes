import { PayinMethodDto, PostApi } from "@passes/api-client"
import classNames from "classnames"
import React, { FC } from "react"
import { usePay } from "src/hooks/usePay"

interface BuyPostButtonProps {
  postId: string
  onSuccess: () => void
  payinMethod?: PayinMethodDto
  isDisabled?: boolean
}

export const BuyPostButton: FC<BuyPostButtonProps> = ({
  postId,
  payinMethod,
  onSuccess,
  isDisabled = false
}) => {
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
      disabled={!!blocked || submitting || isDisabled}
    >
      {loading ? "Processing..." : "Buy post"}
    </button>
  )
}
