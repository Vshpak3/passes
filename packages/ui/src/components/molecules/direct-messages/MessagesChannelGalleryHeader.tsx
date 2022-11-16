import { ChannelMemberDto } from "@passes/api-client"
import BackIcon from "public/icons/chevron-left-icon.svg"
import CurrencyIcon from "public/icons/messages-currency-icon.svg"
import React, { Dispatch, FC, SetStateAction, useCallback } from "react"

import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"

type OrderType = "purchased" | "notPurchased"

const sortOptions: SortOption<OrderType>[] = [
  { orderType: "purchased" },
  { orderType: "notPurchased" }
]

interface MessagesChannelGalleryHeaderProps {
  gallery: boolean
  setGallery: Dispatch<SetStateAction<boolean>>
  setPaid: Dispatch<SetStateAction<boolean | undefined>>
  selectedChannel: ChannelMemberDto
  paid?: boolean
}

export const MessagesChannelGalleryHeader: FC<
  MessagesChannelGalleryHeaderProps
> = ({ gallery, setGallery, paid, setPaid, selectedChannel }) => {
  const onSortSelect = useCallback(
    (option: SortOption<OrderType>) => {
      setPaid(option.orderType === "purchased")
    },
    [setPaid]
  )

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center justify-start pl-2">
        <div className="flex items-center gap-3">
          <BackIcon className="h-4 w-4" onClick={() => setGallery(!gallery)} />
          <div className="flex w-full flex-col items-start justify-center gap-1">
            {paid === undefined ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-white/80">
                Content gallery
              </span>
            ) : paid ? (
              <span className="flex cursor-pointer items-center justify-start">
                <span className="pr-1">
                  <CurrencyIcon />
                </span>
                <span className="text-[16px] font-medium leading-[16px] text-white/80">
                  Purchased content gallery
                </span>
              </span>
            ) : !paid ? (
              <span className="flex cursor-pointer items-center justify-start text-[16px] font-medium leading-[16px] text-white/80">
                Not purchased content gallery
              </span>
            ) : null}
            <span className="cursor-pointer text-[14px] font-medium leading-[17px] text-white/30">
              with {selectedChannel.otherUserDisplayName}
            </span>
          </div>
        </div>
      </div>
      <SortDropdown
        dropdownTitle="Filter by"
        isCheckbox={false}
        onSelect={onSortSelect}
        options={sortOptions}
        selection={{ orderType: paid ? "purchased" : "notPurchased" }}
      />
    </div>
  )
}
