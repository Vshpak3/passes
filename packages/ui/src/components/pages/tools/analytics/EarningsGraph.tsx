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
import { eachDayOfInterval } from "date-fns"
import { uniqueId } from "lodash"
import ms from "ms"
import React, { FC, useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import { DateRangePicker } from "react-date-range"

import { TabButton } from "src/components/atoms/button/TabButton"
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

export const EarningsGraph: FC<EarningsGraphProps> = ({ userBalance }) => {
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
  const { startDate, endDate } = dateRange

  const datePickerModalToggle = () =>
    setIsDatePickerOpen((prevState) => !prevState)

  const handleOnTabClick = (value: CreatorEarningDtoTypeEnum) => {
    setActiveTab(value)
  }
  const api = new CreatorStatsApi()

  const fetchEarnings = React.useCallback(async () => {
    const data = await api.getEarningsHistory({
      getCreatorEarningsHistoryRequestDto: {
        start: startDate,
        end: endDate,
        type: activeTab as GetCreatorEarningsHistoryRequestDtoTypeEnum
      }
    })
    setGraphData(data.earnings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, activeTab])

  React.useEffect(() => {
    fetchEarnings()
  }, [fetchEarnings])

  const dateDiff = (first: Date, second: Date) => {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    // add One to include endDate
    return Math.round((second?.valueOf() - first?.valueOf()) / ONE_DAY) + 1
  }

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="relative flex w-fit flex-col gap-[8px] rounded-[6px] border border-solid border-passes-gray bg-[#100C11] p-[10px]">
        <h3 className="text-2xl font-bold">
          {dateDiff(startDate, endDate)} Days
        </h3>
        <label
          className="flex cursor-pointer flex-row items-end gap-[24px] font-bold text-[#767676]"
          htmlFor="calender-modal"
          onChange={datePickerModalToggle}
        >
          {getFormattedDate(startDate)} - {getFormattedDate(endDate)}
          <Caret height={15} stroke="#3A444C" width={15} />
          <input className="hidden" id="calender-modal" type="checkbox" />
        </label>
        <label className="cursor-pointer" htmlFor="calender-modal">
          <label
            className="absolute flex w-fit items-center justify-center rounded-[15px] bg-white"
            htmlFor=""
          >
            {isDatePickerOpen && (
              <div className="w-fit" ref={datepickerRef}>
                <DateRangePicker
                  maxDate={new Date()}
                  minDate={getNYearsAgoDate(2)}
                  onChange={(newRange) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setDateRange(newRange.selection as any)
                  }}
                  ranges={[dateRange]}
                />
              </div>
            )}
          </label>
        </label>
      </div>
      <div className="flex flex-row flex-wrap gap-[16px] pb-2">
        {EARNINGS_GRAPH_TABS.map(({ id, value, label }) => (
          <TabButton
            active={activeTab === value}
            className="min-w-fit rounded-[5px] !px-[16px] !py-[9px] text-[14px]"
            key={id}
            label={label}
            onClick={() => handleOnTabClick(value)}
          />
        ))}
      </div>
      <div className="text-2xl font-bold">
        {formatCurrency(userBalance || 0)}
      </div>
      <div className="w-full">
        <Line
          className="rounded-[15px] border border-[#FFFFFF26] bg-[#12070E80] p-4"
          data={{
            labels: eachDayOfInterval({
              start: startDate,
              end: endDate
            }).map((item) => item.toLocaleDateString()),
            datasets: [
              {
                showLine: true,
                fill: false,
                borderColor: "#9C4DC1",
                pointBackgroundColor: "#9C4DC1",
                data: graphData.map(({ amount }) => amount)
              }
            ]
          }}
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
    label: "Subscriptions",
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
    label: "Super Memberships",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Lifetime
  },
  {
    label: "Chargebacks",
    id: uniqueId(),
    value: CreatorEarningDtoTypeEnum.Chargebacks
  }
]
