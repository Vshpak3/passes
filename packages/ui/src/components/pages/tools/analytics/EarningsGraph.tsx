import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import {
  CreatorEarningDto,
  CreatorEarningDtoTypeEnum,
  CreatorStatsApi,
  GetCreatorEarningsHistoryRequestDtoTypeEnum
} from "@passes/api-client"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js"
import { uniqueId } from "lodash"
import ms from "ms"
import React, { FC, useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import { DateRangePicker } from "react-date-range"

import { TabButton } from "src/components/atoms/Button"
import {
  formatCurrency,
  getFormattedDate,
  getNYearsAgoDate
} from "src/helpers/formatters"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { Caret } from "src/icons/Caret"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ONE_DAY = ms("1 day")

interface EarningsGraphProps {
  userBalance?: number
}

const EarningsGraph: FC<EarningsGraphProps> = ({ userBalance }) => {
  const datepickerRef = useRef(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  useOnClickOutside(datepickerRef, () => setIsDatePickerOpen(false))
  const [activeTab, setActiveTab] = useState<CreatorEarningDtoTypeEnum>(
    CreatorEarningDtoTypeEnum.Total
  )
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - ms("2 weeks")),
    endDate: new Date(),
    key: "selection"
  })
  const [graphData, setGraphData] = React.useState<Array<CreatorEarningDto>>([])

  const datePickerModalToggle = () =>
    setIsDatePickerOpen((prevState) => !prevState)

  const handleOnTabClick = (value: CreatorEarningDtoTypeEnum) => {
    setActiveTab(value)
  }
  const api = new CreatorStatsApi()

  const fetchEarnings = React.useCallback(async () => {
    const data = await api.getEarningsHistory({
      getCreatorEarningsHistoryRequestDto: {
        start: dateRange.startDate,
        end: dateRange.endDate,
        type: activeTab as GetCreatorEarningsHistoryRequestDtoTypeEnum
      }
    })
    setGraphData(data.earnings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, activeTab])

  React.useEffect(() => {
    fetchEarnings()
  }, [fetchEarnings])

  const dateDiff = (first: any, second: any) => {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    // add One to include endDate
    return Math.round((second - first) / ONE_DAY) + 1
  }

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="relative flex flex-col gap-[8px]">
        <h3 className="text-2xl font-bold">
          {dateDiff(dateRange.startDate, dateRange.endDate)} Days
        </h3>
        <label
          htmlFor="calender-modal"
          className="modal-button flex cursor-pointer flex-row items-end gap-[24px] text-base font-bold"
          onChange={datePickerModalToggle}
        >
          {getFormattedDate(dateRange.startDate)} -{" "}
          {getFormattedDate(dateRange.endDate)}
          <Caret height={15} width={15} />
          <input
            type="checkbox"
            id="calender-modal"
            className="modal-toggle hidden"
          />
        </label>
        <label htmlFor="calender-modal" className="modal cursor-pointer">
          <label
            className="absolute flex w-fit items-center justify-center rounded-[15px] bg-[#fff]"
            htmlFor=""
          >
            {isDatePickerOpen && (
              <div className="w-fit" ref={datepickerRef}>
                <DateRangePicker
                  ranges={[dateRange]}
                  maxDate={new Date()}
                  minDate={getNYearsAgoDate(2)}
                  onChange={(newRange) => {
                    setDateRange(newRange.selection as any)
                  }}
                />
              </div>
            )}
          </label>
        </label>
      </div>
      <div className="flex flex-row gap-[16px]">
        {EARNINGS_GRAPH_TABS.map((tab) => (
          <TabButton
            variant="tab"
            key={tab.id}
            onClick={() => handleOnTabClick(tab.value)}
            active={activeTab === tab.value}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="text-2xl font-bold">
        {formatCurrency(userBalance || 0)}
      </div>
      <div className="w-full">
        <Line
          options={{
            responsive: true,
            showLine: true,
            plugins: {
              legend: {
                display: false
              }
            },
            spanGaps: true,
            scales: {
              x: {
                grid: {
                  display: true,
                  color: "#2C282D"
                }
              },
              y: {
                grid: {
                  display: false
                },
                position: "right",
                ticks: {
                  callback: (value) => {
                    return "$" + value
                  }
                }
              }
            }
          }}
          data={{
            labels: graphData.map((item) =>
              item.createdAt.toLocaleDateString()
            ),
            datasets: [
              {
                showLine: true,
                fill: false,
                borderColor: "#9C4DC1",
                pointBackgroundColor: "#9C4DC1",
                data: graphData.map((item) => item.amount)
              }
            ]
          }}
          className="rounded-[15px] border border-[#FFFFFF26] bg-[#1B141D80] p-4"
        />
      </div>
    </div>
  )
}

const EARNINGS_GRAPH_TABS = [
  {
    label: "All",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Total
  },
  {
    label: "Subscription Passes",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Subscription
  },
  {
    label: "Tips",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Tips
  },
  {
    label: "Posts",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Posts
  },
  {
    label: "Messages",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Messages
  },
  {
    label: "Lifetime Passes",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Lifetime
  },
  {
    label: "Chargebacks",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Chargebacks
  }
]

export default EarningsGraph // eslint-disable-line import/no-default-export
