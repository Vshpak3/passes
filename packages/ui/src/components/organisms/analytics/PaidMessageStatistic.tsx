import { MessagesApi, PaidMessageDto } from "@passes/api-client"
import { format } from "date-fns"
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

  const {
    paidMessageId,
    createdAt,
    text,
    bareContents,
    price,
    sentTo,
    numPurchases,
    earningsPurchases,
    isWelcomeMesage,
    unsentAt
  } = paidMessage

  const unsendMessage = async () => {
    const api = new MessagesApi()
    try {
      await api.unsendPaidMessage({ paidMessageId })
      setUnsent(true)
    } catch (error: unknown) {
      toast.error("Failed to unsend: please contact support")
    }
  }
  const canUnsend = !unsent && !unsentAt && !isWelcomeMesage
  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700]">
          <span className="text-[12px] font-[500]">
            {format(createdAt, "LL/dd/yyyy")}
            <br />
            {format(createdAt, "hh:mm a")}
          </span>
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="passes-break whitespace-pre-wrap text-[14px] font-[700]">
          {formatText(text)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {bareContents?.length ?? 0}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{formatCurrency(price)}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{sentTo}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">{numPurchases}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">
          {formatCurrency(earningsPurchases)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">Create List</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {canUnsend && <Button onClick={unsendMessage}>Unsend</Button>}
          {!canUnsend && !isWelcomeMesage && <>Unsent</>}
          {isWelcomeMesage && <>Welcome Message</>}
        </span>
      </div>
    </div>
  )
}
