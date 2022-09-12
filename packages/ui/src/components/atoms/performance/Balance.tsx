import ChevronLeft from "public/icons/chevron-left-bold-icon.svg"
import React from "react"
import { formatCurrency } from "src/helpers"

interface IBalanceProps {
  balance?: number
}

const Balance: React.FC<IBalanceProps> = ({ balance }) => {
  return (
    <div className="cover-image relative mt-5 overflow-hidden rounded-[6px] border border-passes-dark-500 py-7 pl-6 pr-[34px] lg:absolute lg:right-5 lg:top-0 xs:inline-block sidebar-collapse:right-[50px]">
      <span className="text-2xl font-bold leading-6">
        {formatCurrency(balance ? balance : 0)}
      </span>

      <div className="text-label mt-[30px] flex flex-col space-y-2 xs:flex-row xs:space-y-0 xs:space-x-9">
        <p className="text-white/50">Balance available</p>
        <button className="flex items-center space-x-3.5">
          <span className="">Request payout</span>
          <span className="rotate-180">
            <ChevronLeft />
          </span>
        </button>
      </div>
    </div>
  )
}

export default Balance
