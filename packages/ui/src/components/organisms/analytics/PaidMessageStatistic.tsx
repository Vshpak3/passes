import { MessagesApi, PaidMessageDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import React, { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { MessageBuyerDialog } from "src/components/molecules/analytics/MessageBuyerDialog"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { formatCurrency, formatText } from "src/helpers/formatters"
import { PaidMessageStatisticCachedProps } from "./PaidMessageStatisticCached"

interface PaidMessageStatisticProps extends PaidMessageStatisticCachedProps {
  update: (update: Partial<PaidMessageDto>) => void
}

export const PaidMessageStatistic: FC<PaidMessageStatisticProps> = ({
  paidMessage,
  update
}) => {
  const [unsendPaidMessageModelOpen, setUnsendPaidMessageModelOpen] =
    useState(false)
  const [hidePaidMessageModelOpen, setHidePaidMessageModelOpen] =
    useState(false)
  const [messageBuyerDialogOpen, setMessageBuyerDialogOpen] = useState(false)

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
    unsentAt,
    hiddenAt
  } = paidMessage

  const unsendPaidMessage = async () => {
    const api = new MessagesApi()
    try {
      await api.unsendPaidMessage({ paidMessageId })
      update({ unsentAt: new Date() })
      toast.success("Unbrought messages were removed")
    } catch (error: unknown) {
      toast.error("Failed to unsend: please contact support")
    }
  }

  const hidePaidMessage = async () => {
    const api = new MessagesApi()
    try {
      await api.hidePaidMessage({ paidMessageId })
      update({ hiddenAt: new Date() })
      toast.success("Your message was permanently removed")
    } catch (error: unknown) {
      toast.error("Failed to remove: please contact support")
    }
  }

  return (
    <>
      <div
        className={classNames(
          hiddenAt && "hidden",
          "flex flex-row justify-between border-b border-passes-dark-200"
        )}
      >
        <div className="flex h-[72px] flex-1 items-center justify-center">
          <span className="text-[14px] font-[700]">
            <span className="text-[12px] font-[500]">
              {format(createdAt, "LL/dd/yyyy")}
              <br />
              {format(createdAt, "hh:mm a")}
            </span>
          </span>
        </div>
        <div className="passes-break flex h-[72px] flex-1 items-center justify-center truncate whitespace-pre-wrap text-[14px] font-[700]">
          {formatText(text)}
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-passes-gray-800">
          <span className="text-[12px] font-[500]">
            {bareContents?.length ?? 0}
          </span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-passes-gray-800">
          <span className="text-[12px] font-[500]">
            {formatCurrency(price)}
          </span>
        </div>
        <div className="flex h-[72px] flex-1 items-center justify-center text-passes-gray-800">
          <span className="text-[12px] font-[500]">{sentTo}</span>
        </div>
        <div
          className="flex h-[72px] flex-1 items-center justify-center hover:cursor-pointer"
          onClick={() => setMessageBuyerDialogOpen(true)}
        >
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
            {isWelcomeMesage ? (
              <>Welcome Message</>
            ) : !unsentAt ? (
              <Button
                onClick={() => {
                  setUnsendPaidMessageModelOpen(true)
                }}
              >
                Unsend
              </Button>
            ) : (
              <Button
                className="px-[18px]"
                onClick={() => {
                  setHidePaidMessageModelOpen(true)
                }}
                variant={ButtonVariant.PINK_OUTLINE}
              >
                Remove
              </Button>
            )}
          </span>
        </div>
      </div>
      {unsendPaidMessageModelOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setUnsendPaidMessageModelOpen(false)}
          onDelete={unsendPaidMessage}
          text="Unsend"
        />
      )}
      {hidePaidMessageModelOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setHidePaidMessageModelOpen(false)}
          onDelete={hidePaidMessage}
          text="Remove"
        />
      )}
      {messageBuyerDialogOpen && (
        <MessageBuyerDialog
          onClose={() => setMessageBuyerDialogOpen(false)}
          paidMessageId={paidMessageId}
        />
      )}
    </>
  )
}
