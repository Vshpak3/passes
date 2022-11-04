import { PassApi, PayinMethodDto } from "@passes/api-client"
import classNames from "classnames"
import React, { FC, useCallback } from "react"

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
      onClick={submit}
      type="submit"
      {...(blocked || submitting ? { disabled: isDisabled || true } : {})}
    >
      {loading ? "Loading" : "Renew pass"}
    </button>
  )
}
