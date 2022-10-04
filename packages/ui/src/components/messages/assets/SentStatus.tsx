import SentMessagesIcon from "public/icons/sent-messages-icon.svg"
import React from "react"

export const SentStatus = () => (
  <div className="flex items-center justify-center gap-[6px] self-end pt-3">
    <span>
      <SentMessagesIcon />
    </span>
    <span className="text-[16px] font-medium leading-[24px] text-[#767676]">
      Sent
    </span>
  </div>
)
