import {
  PassApi,
  PayinDataDtoBlockedEnum,
  PayinMethodDto
} from "@passes/api-client"
import React, { FC, useCallback, useEffect } from "react"

import { Button } from "src/components/atoms/button/Button"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface BuyPassButtonProps {
  passId: string
  walletAddress?: string
  payinMethod?: PayinMethodDto
  onSuccess: () => void
  owns?: () => void
  isDisabled?: boolean
}

const api = new PassApi()
export const BuyPassButton: FC<BuyPassButtonProps> = ({
  passId,
  walletAddress,
  payinMethod,
  onSuccess,
  owns,
  isDisabled = false
}) => {
  const register = useCallback(async () => {
    return await api.registerPurchasePass({
      createPassHolderRequestDto: {
        passId,
        walletAddress,
        payinMethod
      }
    })
  }, [passId, payinMethod, walletAddress])

  const registerData = useCallback(async () => {
    return await api.registerPurchasePassData({
      createPassHolderRequestDto: {
        passId,
        walletAddress,
        payinMethod
      }
    })
  }, [passId, payinMethod, walletAddress])

  const { blocked, loading, submit, submitData, waiting } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.PASS_PURCHASE
  )

  useEffect(() => {
    if (passId && passId.length) {
      submitData()
    }
  }, [passId, submitData])

  useEffect(() => {
    if (blocked === PayinDataDtoBlockedEnum.AlreadyOwnsPass && owns) {
      owns()
    }
  }, [blocked, owns])
  return (
    <Button
      big
      disabled={waiting || !!blocked || loading || isDisabled}
      fontSize={16}
      onClick={submit}
      variant="pink"
    >
      {waiting ? "Processing..." : loading ? "Loading" : "Buy pass"}
    </Button>
  )
}
