import { MessagesApi, PayinMethodDto } from "@passes/api-client"
import classNames from "classnames"
import React, { FC } from "react"

import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface BuyMessageButtonProps {
  messageId: string
  payinMethod?: PayinMethodDto
  onSuccess: () => void
  isDisabled?: boolean
}

export const BuyMessageButton: FC<BuyMessageButtonProps> = ({
  messageId,
  payinMethod,
  onSuccess,
  isDisabled = false
}) => {
  const api = new MessagesApi()
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

  const { blocked, submitting, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.PURCHASE
  )

  return (
    <button
      className={classNames(
        isDisabled
          ? "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-semibold text-white"
      )}
      disabled={!!blocked || submitting || isDisabled}
      onClick={submit}
      type="submit"
    >
      {loading ? "Loading" : "Buy message"}
    </button>
  )
}
