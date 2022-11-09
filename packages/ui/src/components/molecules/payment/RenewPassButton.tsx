import { PassApi, PayinMethodDto } from "@passes/api-client"
import React, { FC, useCallback } from "react"

import { Button } from "src/components/atoms/button/Button"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface RenewPassButtonProps {
  passHolderId: string
  onSuccess: () => void
  payinMethod?: PayinMethodDto
  isDisabled?: boolean
}

const api = new PassApi()
export const RenewPassButton: FC<RenewPassButtonProps> = ({
  passHolderId,
  payinMethod,
  onSuccess,
  isDisabled = false
}) => {
  const register = useCallback(async () => {
    return await api.registerRenewPass({
      renewPassHolderRequestDto: {
        passHolderId,
        payinMethod
      }
    })
  }, [passHolderId, payinMethod])

  const registerData = useCallback(async () => {
    return await api.registerRenewPassData({
      renewPassHolderRequestDto: {
        passHolderId,
        payinMethod
      }
    })
  }, [passHolderId, payinMethod])

  const { blocked, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.PURCHASE
  )

  return (
    <Button
      big
      onClick={submit}
      variant="pink"
      {...(blocked || loading ? { disabled: isDisabled || true } : {})}
    >
      {loading ? "Loading" : "Renew pass"}
    </Button>
  )
}
