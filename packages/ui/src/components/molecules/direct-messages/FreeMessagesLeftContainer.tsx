import React, { FC } from "react"

interface Props {
  freeMessages: number | null
}
export const FreeMessagesLeftContainer: FC<Props> = ({ freeMessages }) => {
  return (
    <div className="flex items-center justify-between gap-[10px] border-b border-[#FFFF]/10 bg-[#5f2c2f]/50 py-[10px] px-4 backdrop-blur-[25px]">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-[#FBFBFB]">You have</span>
        <span className="text-base font-medium text-[#C943A8] ">
          {freeMessages ?? "unlimited"} free
        </span>
        <span className="text-sm font-medium text-[#FBFBFB]">
          messages left.
          {freeMessages === 0 ? " You can only send message with tip now." : ""}
        </span>
      </div>
    </div>
  )
}
