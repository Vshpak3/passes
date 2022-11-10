import { MessagesApi, PaidMessageDto } from "@passes/api-client"
import React, { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { formatCurrency, formatText } from "src/helpers/formatters"

interface PaidMessageStatisticProps {
  paidMessage: PaidMessageDto
}

export const PaidMessageStatistic: FC<PaidMessageStatisticProps> = ({
  paidMessage
}) => {
  const [unsent, setUnsent] = useState<boolean>(false)

  const unsendMessage = async () => {
    const api = new MessagesApi()
    try {
      await api.unsendPaidMessage({ paidMessageId: paidMessage.paidMessageId })
      setUnsent(true)
    } catch (error: unknown) {
      toast.error("Failed to unsend: please contact support")
    }
  }
  const canUnsend =
    !unsent && !paidMessage.unsentAt && !paidMessage.isWelcomeMesage
  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700]">
          {paidMessage.createdAt.toLocaleString()}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="passes-break whitespace-pre-wrap text-[14px] font-[700]">
          {formatText(paidMessage.text)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {paidMessage.bareContents?.length ?? 0}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {formatCurrency(paidMessage.price)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{paidMessage.sentTo}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">
          {paidMessage.numPurchases}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">
          {formatCurrency(paidMessage.earningsPurchases)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">Create List</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {canUnsend && <Button onClick={unsendMessage}>Unsend</Button>}
          {!canUnsend && <>Unsent</>}
        </span>
      </div>
    </div>
  )
}
