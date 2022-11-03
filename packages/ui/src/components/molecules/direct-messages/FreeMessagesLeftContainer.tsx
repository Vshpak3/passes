import React, { FC } from "react"

interface FreeMessagesLeftContainerProps {
  freeMessages: number | null
}

export const FreeMessagesLeftContainer: FC<FreeMessagesLeftContainerProps> = ({
  freeMessages
}) => {
  return (
    <div className="ml-6 flex max-w-xl items-center justify-between gap-[10px] rounded-b-[10px] border-b border-[#FFFF]/10 bg-gradient-to-r from-[#B52A6F33] to-[#B52A6F33]/20 py-[10px] px-6 backdrop-blur-[25px]">
      <div className="flex flex-wrap items-center gap-1 text-sm font-medium text-[#FBFBFB]">
        You have
        <span className="text-base font-medium text-[#C943A8]">
          {freeMessages ?? "unlimited"} free
        </span>
        <span>messages left.</span>
        {freeMessages === 0 && " You can only send messages with a tip now."}
      </div>
    </div>
  )
}
