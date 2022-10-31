import { FC } from "react"

import { formatCurrency } from "src/helpers/formatters"

interface AnalyticsHeaderProps {
  balance?: number
}
export const AnalyticsHeader: FC<AnalyticsHeaderProps> = ({ balance }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-1 flex-col justify-between pt-2">
        <h2 className="text-2xl font-bold">Analytics</h2>
      </div>
      <div className="cover-image card flex h-[137px] w-full flex-col justify-between rounded-md border border-gray-800 p-4 md:w-[373px]">
        <h4 className="card-title text-3xl">
          {formatCurrency(balance ? balance : 0)}
        </h4>
        <div className="g flex flex-row gap-[16px]">
          <p className="text-[#ccc]">Balance available</p>
        </div>
      </div>
    </div>
  )
}
