import {
  PassApi,
  PayinDataDtoBlockedEnum,
  PayinMethodDto
} from "@passes/api-client"
import classNames from "classnames"
import React, { FC, useCallback, useEffect } from "react"

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

  const { blocked, submitting, loading, submit, submitData, waiting } = usePay(
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
    <button
      className={classNames(
        !!blocked || submitting || isDisabled
          ? "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-[500] text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-[500] text-white"
      )}
      disabled={waiting || !!blocked || submitting || isDisabled}
      onClick={submit}
      type="submit"
    >
      {waiting ? "Processing..." : loading ? "Loading" : "Buy pass"}
    </button>
  )
}
