import { MessagesApi, PayinMethodDto } from "@passes/api-client"
import React from "react"

import { wrapApi } from "../../helpers"
import { usePay } from "../../hooks/usePay"

interface ISendMessageButton {
  text: string
  attachments: any[]
  channelId: string
  tipAmount?: number
  content: string[]
  payinMethod?: PayinMethodDto
}

export const BuyPassButton = ({
  text,
  attachments,
  channelId,
  tipAmount,
  content,
  payinMethod
}: ISendMessageButton) => {
  const api = wrapApi(MessagesApi)
  const register = async () => {
    return await api.sendMessage({
      sendMessageRequestDto: {
        text,
        attachments,
        channelId,
        tipAmount: tipAmount ? tipAmount : 0,
        content,
        payinMethod
      }
    })
  }

  const registerData = async () => {
    return await api.sendMessageData({
      sendMessageRequestDto: {
        text,
        attachments,
        channelId,
        tipAmount: tipAmount ? tipAmount : 0,
        content,
        payinMethod
      }
    })
  }

  const { blocked, amountUSD, submitting, loading, submit } = usePay(
    register,
    registerData
  )

  return (
    <button
      onClick={() => {
        submit()
      }}
      className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
      type="submit"
      {...(blocked || submitting ? { disabled: true } : {})}
    >
      {loading ? "loading" : `Pay ${amountUSD}`}
    </button>
  )
}
