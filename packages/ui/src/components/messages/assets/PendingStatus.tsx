import PendingMessageIcon from "public/icons/pending-messages-icon.svg"
import React from "react"

export const PendingStatus = () => (
  <div className="flex items-center justify-center gap-[6px] self-end pt-3">
    <span>
      <PendingMessageIcon className="animate-spin" />
    </span>
    <span className="text-[16px] font-medium leading-[24px] text-[#767676]">
      Pending...
    </span>
  </div>
)
