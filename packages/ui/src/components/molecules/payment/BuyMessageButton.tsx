import { MessagesApi, PayinMethodDto } from "@passes/api-client"
import React, { FC, useCallback } from "react"

import { Button } from "src/components/atoms/button/Button"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface BuyMessageButtonProps {
  messageId: string
  payinMethod?: PayinMethodDto
  onSuccess: () => void
  isDisabled?: boolean
}

const api = new MessagesApi()

export const BuyMessageButton: FC<BuyMessageButtonProps> = ({
  messageId,
  payinMethod,
  onSuccess,
  isDisabled = false
}) => {
  const register = useCallback(async () => {
    return await api.registerPurchaseMessage({
      purchaseMessageRequestDto: {
        messageId,
        payinMethod
      }
    })
  }, [messageId, payinMethod])
  const registerData = useCallback(async () => {
    return await api.registerPurchaseMessageData({
      purchaseMessageRequestDto: {
        messageId,
        payinMethod
      }
    })
  }, [messageId, payinMethod])

  const { blocked, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.PURCHASE
  )

  return (
    <Button disabled={!!blocked || loading || isDisabled} onClick={submit}>
      {loading ? "Loading" : "Buy message"}
    </Button>
  )
}
