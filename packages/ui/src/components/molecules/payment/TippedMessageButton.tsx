import { MessagesApi, SendMessageRequestDto } from "@passes/api-client"
import classNames from "classnames"
import React, { FC, useCallback } from "react"

import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface TippedMessageButtonProps {
  messageRequest: SendMessageRequestDto
  onSuccess: () => void
  isDisabled?: boolean
}
const api = new MessagesApi()

export const TippedMessageButton: FC<TippedMessageButtonProps> = ({
  messageRequest,
  onSuccess,
  isDisabled = false
}) => {
  const register = useCallback(async () => {
    return await api.sendMessage({
      sendMessageRequestDto: messageRequest
    })
  }, [messageRequest])
  const registerData = useCallback(async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: messageRequest
    })
  }, [messageRequest])

  const { blocked, submitting, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.TIP
  )

  return (
    <button
      className={classNames(
        isDisabled
          ? "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-[500] text-white opacity-[0.40]"
          : "flex w-full items-center justify-center rounded-full border border-solid border-passes-pink-100 bg-passes-pink-100 py-[10px] text-base font-[500] text-white"
      )}
      disabled={!!blocked || submitting || isDisabled}
      onClick={submit}
      type="submit"
    >
      {loading ? "Loading" : "Send message"}
    </button>
  )
}
