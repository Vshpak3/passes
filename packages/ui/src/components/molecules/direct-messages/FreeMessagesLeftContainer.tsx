import React, { FC } from "react"

interface FreeMessagesLeftContainerProps {
  freeMessages: number | null
}

export const FreeMessagesLeftContainer: FC<FreeMessagesLeftContainerProps> = ({
  freeMessages
}) => {
  return (
    <div className="ml-6 flex w-2/3 min-w-[300px] max-w-xl items-center justify-between gap-[10px] rounded-b-[8px] border-b border-[#FFFF]/10 bg-gradient-to-r from-[#B52A6F33] to-[#B52A6F33]/20 py-[8px] px-6 backdrop-blur-[25px]">
      <div className="flex min-w-[300px] flex-wrap items-center gap-1 text-xs font-medium text-[#FBFBFB]">
        You have
        <span className="text-sm font-medium text-[#C943A8]">
          {freeMessages ?? "unlimited"} free
        </span>
        <span>messages left.</span>
        <span className="hidden sm:block">
          {freeMessages === 0 && " You can only send messages with a tip now."}
        </span>
      </div>
    </div>
  )
}
