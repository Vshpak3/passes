import { MessagesApi, SendMessageRequestDto } from "@passes/api-client"
import React, { FC, useCallback } from "react"

import { Button } from "src/components/atoms/button/Button"
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

  const { blocked, loading, submit } = usePay(
    register,
    registerData,
    onSuccess,
    LandingMessageEnum.TIP
  )

  return (
    <Button big disabled={!!blocked || loading || isDisabled} onClick={submit}>
      {loading ? "Loading" : "Send message"}
    </Button>
  )
}
