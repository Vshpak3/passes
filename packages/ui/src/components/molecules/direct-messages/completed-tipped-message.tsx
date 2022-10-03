import BigStar from "public/icons/tipped-star-big-icon.svg"
import DefaultStar from "public/icons/tipped-star-default-icon.svg"
import MediumStar from "public/icons/tipped-star-medium-icon.svg"
import SmallStar from "public/icons/tipped-star-small-icon.svg"
import React from "react"
import { formatCurrency } from "src/helpers"

export const TippedMessage = ({ tipAmount = 10 }) => {
  return (
    <div className="relative flex rounded-[6px]">
      <BigStar className="absolute -top-2 -left-2" />
      <MediumStar className="absolute -top-5 left-4" />
      <SmallStar className="absolute -top-3 -left-3" />
      <DefaultStar className="absolute -bottom-[5px] left-1" />
      <DefaultStar className="absolute -bottom-6 -left-4" />
      <DefaultStar className="absolute -bottom-0 right-6" />
      <DefaultStar className="absolute -bottom-3 -right-1" />
      <div className="box-border rounded-l-md border border-[#363037] bg-white py-[55px] px-[28px] text-black">
        Tip
      </div>
      <div className="box-border flex flex-col items-center justify-center rounded-r-md border border-l-0 border-[#363037] bg-black px-7">
        <span className="text-[14px] font-medium leading-[24px] text-white">
          Thank you for your tip
        </span>
        <span className="text-center text-[42px] font-bold leading-[53px] text-[#BF7AF0]">
          {formatCurrency(tipAmount)}
        </span>
      </div>
    </div>
  )
}
