import {
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PostApi
} from "@passes/api-client"
import React, { FC, useCallback } from "react"

import { Button } from "src/components/atoms/button/Button"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface BuyPostButtonProps {
  postId: string
  onSuccess: () => void
  payinMethod?: PayinMethodDto
  isDisabled?: boolean
}

const api = new PostApi()
export const BuyPostButton: FC<BuyPostButtonProps> = ({
  postId,
  payinMethod,
  onSuccess,
  isDisabled = false
}) => {
  const hasNoPaymentMethod =
    payinMethod?.method === PayinMethodDtoMethodEnum.None
  const register = useCallback(async () => {
    return await api.registerPurchasePost({
      purchasePostRequestDto: {
        postId,
        payinMethod
      }
    })
  }, [payinMethod, postId])
  const registerData = useCallback(async () => {
    return await api.registerPurchasePostData({
      purchasePostRequestDto: {
        postId,
        payinMethod
      }
    })
  }, [payinMethod, postId])

  const { blocked, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.PURCHASE
  )

  return (
    <Button
      big
      disabled={!!blocked || loading || isDisabled || hasNoPaymentMethod}
      fontSize={16}
      onClick={submit}
    >
      {loading ? "Processing..." : "Buy post"}
    </Button>
  )
}
