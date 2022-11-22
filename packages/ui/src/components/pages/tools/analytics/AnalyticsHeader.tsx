import { formatCurrency } from "src/helpers/formatters"
import { useCreatorBalance } from "src/hooks/useAnalytics"

export const AnalyticsHeader = () => {
  const { userBalance } = useCreatorBalance()
  return (
    <div className="flex flex-col md:flex-row">
      <div className="cover-image flex h-[137px] w-full flex-col justify-between rounded-md border border-gray-800 p-4 md:w-[373px]">
        <h4 className="text-3xl">
          {formatCurrency(userBalance?.net?.amount ?? 0)}
        </h4>
        <div className="flex flex-row gap-[16px]">
          <p className="text-[#ccc]">Balance available</p>
        </div>
      </div>
    </div>
  )
}
