import { PayinDataDto, PayinMethodDto, PostApi } from "@passes/api-client"
import classNames from "classnames"
import React from "react"
import { usePay } from "src/hooks/usePay"

interface ITipPostButton {
  postId: string
  amount: number
  payinMethod?: PayinMethodDto
  isDisabled?: boolean
  onSuccess: () => void
}

export const TipPostButton = ({
  postId,
  amount,
  payinMethod,
  onSuccess,
  isDisabled = false
}: ITipPostButton) => {
  if (!amount || amount < 5) {
    isDisabled = true
  }
  const api = new PostApi()
  const register = async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId,
        amount,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return { blocked: undefined, amount } as PayinDataDto
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData,
    onSuccess
  )

  const buttonText = amountUSD > 0 ? `Pay ${amountUSD}` : "Tip post"

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
