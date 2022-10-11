import BackIcon from "public/icons/chevron-left-icon.svg"
import CurrencyIcon from "public/icons/messages-currency-icon.svg"
import React, { Dispatch, FC, SetStateAction } from "react"

interface MessagesChannelGalleryHeaderProps {
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  activeContent: string
  setActiveContent: Dispatch<SetStateAction<any>>
}

export const MessagesChannelGalleryHeader: FC<
  MessagesChannelGalleryHeaderProps
> = ({ gallery, setGallery, activeContent, setActiveContent }) => {
  const channelName = "TestAccount"
  return (
    <div className="flex w-full  items-center justify-between">
      <div className="flex w-full items-center justify-start pl-2">
        <div className="flex items-center gap-3">
          <BackIcon className="h-4 w-4" onClick={() => setGallery(!gallery)} />
          <div className="flex w-full flex-col items-start justify-center gap-1">
            {activeContent === "All" ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                Content gallery
              </span>
            ) : activeContent === "Purchased" ? (
              <span className="flex cursor-pointer items-center justify-start">
                <span className="pr-1">
                  <CurrencyIcon />
                </span>
                <span className="text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                  Purchased content gallery
                </span>
              </span>
            ) : activeContent === "Not Purchased" ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-[#FFF]/80">
                Not purchased content gallery
              </span>
            ) : null}
            <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-[#FFF]/30">
              with {channelName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center pr-10">
        <div
          onClick={() => setActiveContent("All")}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          All
        </div>
        <span className="px-3 text-passes-pink-100">|</span>
        <div
          onClick={() => setActiveContent("Not Purchased")}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          Show Not Purchased
        </div>
        <span className="px-3 text-passes-pink-100">|</span>
        <div
          onClick={() => setActiveContent("Purchased")}
          className="flex cursor-pointer justify-end text-passes-pink-100 hover:underline "
        >
          Show Purchased
        </div>
      </div>
    </div>
  )
}
