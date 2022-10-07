import React, { FC } from "react"
interface Props {
  freeMessages?: number
  isCreator?: boolean
}
export const FreeMessagesLeftContainer: FC<Props> = ({ freeMessages }) => {
  return (
    <div className="flex items-center justify-between gap-[10px] border-b border-[#FFFF]/10 bg-[#5f2c2f]/50 py-[10px] px-4 backdrop-blur-[25px]">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-[#FBFBFB]">You have</span>
        <span className="text-base font-medium text-[#C943A8] ">
          {freeMessages} free
        </span>
        <span className="text-sm font-medium text-[#FBFBFB]">
          messages left.
        </span>
      </div>
      {/* TODO: this features will be added after backend is ready */}
      {/* <span>
    <PostUnlockButton
      onClick={() => setOpenBuyMessagesModal(!openBuyMessagesModal)}
      value={openBuyMessagesModal}
      name="unlock more messages"
      className="gap-[6px] rounded-[50px] bg-[#C943A8] py-[6px] px-[12px] text-sm"
    />
  </span> */}
      {/* <BuyMessagesModal
    isOpen={openBuyMessagesModal}
    setOpen={setOpenBuyMessagesModal}
    freeMessages={freeMessages}
    setFreeMessages={setFreeMessages}
  /> */}
    </div>
  )
}
