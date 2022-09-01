import React from "react"
import { formatCurrency } from "src/helpers"
import Caret from "src/icons/caret"
interface IAnalyticsHeader {
  balance?: number
}
const AnalyticsHeader: React.FC<IAnalyticsHeader> = ({
  balance
}: IAnalyticsHeader) => {
  return (
    <div className="flex flex-col bg-black md:flex-row ">
      <div className="flex flex-1 flex-col justify-between pt-2">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="breadcrumbs text-sm">
          <ul>
            <li className="text-base font-medium">
              <a>Creator</a>
            </li>
            <li>
              <a className="text-base">Data Analytics</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="cover-image card flex h-[137px] w-full flex-col justify-between rounded-md border border-gray-800 p-4 md:w-[373px]">
        <h4 className="card-title text-3xl">
          {formatCurrency(balance ? balance : 0)}
        </h4>
        <div className="g flex flex-row gap-[16px]">
          <p className="text-[#ccc]">Balance available</p>
          <a className="flex cursor-pointer flex-row items-center gap-[8px] hover:underline">
            Request Payment <Caret className="-rotate-90" />
          </a>
        </div>
      </div>
    </div>
  )
}
export default AnalyticsHeader
