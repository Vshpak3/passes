import classNames from "classnames"
import BigStar from "public/icons/tipped-star-big-icon.svg"
import DefaultStar from "public/icons/tipped-star-default-icon.svg"
import MediumStar from "public/icons/tipped-star-medium-icon.svg"
import SmallStar from "public/icons/tipped-star-small-icon.svg"
import React from "react"

import { formatCurrency } from "../../../helpers"
import { Avatar } from "../messages"

export const TippedMessage = ({ isOwnMessage = true, tipAmount = 10 }) => {
  return (
    <div
      className={classNames(
        "m-4 flex max-w-[70%] rounded",
        isOwnMessage && "flex-row-reverse self-end"
      )}
    >
      {!isOwnMessage && (
        <div className="flex w-[35%] items-end">
          <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
        </div>
      )}
      <div className="relative mx-4 flex rounded-[6px]">
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
    </div>
  )
}
