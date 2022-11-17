import classNames from "classnames"
import BannerArrow from "public/icons/banner-arrow.svg"
import React, { Dispatch, FC, SetStateAction } from "react"

interface FreeMessagesLeftContainerProps {
  freeMessages: number | null
  bannerPopUp: boolean
  setBannerPopUp: Dispatch<SetStateAction<boolean>>
}

export const FreeMessagesLeftContainer: FC<FreeMessagesLeftContainerProps> = ({
  freeMessages,
  bannerPopUp,
  setBannerPopUp
}) => {
  return (
    <div
      className={classNames(
        bannerPopUp
          ? "-translate-y-0 transform transition duration-100"
          : " -translate-y-7 transform transition duration-100 hover:-translate-y-0 ",
        "6-b ml-6 flex w-5/6 min-w-[300px]  max-w-xl cursor-pointer items-center justify-between gap-[10px] rounded-b-[8px] border-[#FFFF]/10 bg-gradient-to-r from-[#B52A6F33] to-[#B52A6F33]/20 py-[8px] px-6 backdrop-blur-[25px]"
      )}
      onClick={() => setBannerPopUp(!bannerPopUp)}
    >
      <div className="flex min-w-[300px] flex-wrap items-center gap-1 text-xs font-medium text-[#FBFBFB]">
        You have
        <span className="text-sm font-medium text-[#C943A8]">
          {freeMessages ?? "unlimited"} free
        </span>
        <span>messages left.</span>
        <span className="hidden sm:block">
          {freeMessages === 0 && " You can only send messages with a tip now."}
        </span>
        <div className="absolute left-[50%] bottom-[-7px] translate-x-[-50%]">
          <BannerArrow className="rotate-180 stroke-gray-500/60" />
        </div>
      </div>
    </div>
  )
}
