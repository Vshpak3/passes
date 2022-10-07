import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import { FC, useState } from "react"
import { formatCurrency } from "src/helpers"

import { ProgressBar } from "./ProgressBarProps"

interface FundraiserTabProps {
  post: any
}

export const FundraiserTab: FC<FundraiserTabProps> = ({ post }) => {
  const [goal] = useState(post?.goal || 100)
  const [amountCollected, setAmountColleted] = useState(
    post?.collectedAmount || 0
  )
  const [numberOfDonations, setNumberOfDonations] = useState(
    post?.numberOfDonations || 0
  )

  const onDonate = (amount: any) => {
    setNumberOfDonations(numberOfDonations + 1)
    setAmountColleted(amountCollected + amount)
  }

  const progressPercentage = Math.min(
    100,
    Math.floor((amountCollected / goal) * 100)
  )
  return (
    <div className="flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center text-[#ffffff]">
          <span className="pr-2">
            <FundraiserDollarIcon />
          </span>
          <span className="pr-1 text-[15px] font-medium leading-[16px] tracking-[0.003em]">
            {formatCurrency(amountCollected)}
          </span>
          <span className="self-end text-xs tracking-[0.003em]">
            USD raised of $100,000 goal
          </span>
        </div>
        <div className="self-end text-xs tracking-[0.003em] text-[#ffffff]/50">
          <span>{numberOfDonations}</span>
          <span> donations</span>
        </div>
      </div>
      <div className="flex w-full pt-3">
        <ProgressBar progressPercentage={progressPercentage} />
      </div>
      <span className="pt-[5px] text-[10px] leading-[16px] tracking-[0.003em] text-[#ffffff]/50">
        Last donation 1 hr ago
      </span>
      <div className="flex items-center gap-[5px] p-0 pt-[10px]">
        <span className="text-base font-medium text-[#ffff]/90">
          Donate now
        </span>
        {post.donationTypes.map((amount: any, index: any) => (
          <button
            key={index}
            onClick={() => onDonate(amount)}
            className="flex items-start gap-[10px] rounded-[56px] bg-[#0E0A0F] py-[10px] px-[18px] text-base font-bold leading-[25px] text-[#ffff]/90 hover:bg-passes-secondary-color/10"
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  )
}
