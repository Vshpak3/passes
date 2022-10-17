import { ChannelMemberDto } from "@passes/api-client"
import BackIcon from "public/icons/chevron-left-icon.svg"
import CurrencyIcon from "public/icons/messages-currency-icon.svg"
import React, { Dispatch, FC, SetStateAction } from "react"

interface MessagesChannelGalleryHeaderProps {
  gallery: boolean
  setGallery: Dispatch<SetStateAction<boolean>>
  paid?: boolean
  setPaid: Dispatch<SetStateAction<boolean | undefined>>
  selectedChannel: ChannelMemberDto
}

export const MessagesChannelGalleryHeader: FC<
  MessagesChannelGalleryHeaderProps
> = ({ gallery, setGallery, paid, setPaid, selectedChannel }) => {
  return (
    <div className="flex w-full  items-center justify-between">
      <div className="flex w-full items-center justify-start pl-2">
        <div className="flex items-center gap-3">
          <BackIcon className="h-4 w-4" onClick={() => setGallery(!gallery)} />
          <div className="flex w-full flex-col items-start justify-center gap-1">
            {paid === undefined ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                Content gallery
              </span>
            ) : paid ? (
              <span className="flex cursor-pointer items-center justify-start">
                <span className="pr-1">
                  <CurrencyIcon />
                </span>
                <span className="text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                  Purchased content gallery
                </span>
              </span>
            ) : !paid ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                Not purchased content gallery
              </span>
            ) : null}
            <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-[#FFF]/30">
              with {selectedChannel.otherUserDisplayName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center pr-10 text-[12px]">
        <div
          onClick={() => setPaid(undefined)}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          All
        </div>
        <span className="px-3 text-passes-pink-100">|</span>
        <div
          onClick={() => setPaid(false)}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          Show Not Purchased
        </div>
        <span className="px-3 text-passes-pink-100">|</span>
        <div
          onClick={() => setPaid(true)}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          Show Purchased
        </div>
      </div>
    </div>
  )
}
