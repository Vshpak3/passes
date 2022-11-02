import React, { FC } from "react"

interface FreeMessagesLeftContainerProps {
  freeMessages: number | null
}

export const FreeMessagesLeftContainer: FC<FreeMessagesLeftContainerProps> = ({
  freeMessages
}) => {
  return (
    <div className="ml-6 flex w-full items-center justify-between gap-[10px] rounded-b-[10px] border-b border-[#FFFF]/10 bg-gradient-to-r from-[#B52A6F33] to-[#B52A6F33]/20 py-[10px] px-6 backdrop-blur-[25px]">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-[#FBFBFB]">You have</span>
        <span className="text-base font-medium text-[#C943A8]">
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
