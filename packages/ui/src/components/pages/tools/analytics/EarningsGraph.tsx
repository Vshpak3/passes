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
import { differenceInDays, eachDayOfInterval, isSameDay } from "date-fns"
import { uniqueId } from "lodash"
import ms from "ms"
import React, { useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import { DateRangePicker } from "react-date-range"

import { TabButton } from "src/components/atoms/button/TabButton"
import { getFormattedDate, getNYearsAgoDate } from "src/helpers/formatters"
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

export const EarningsGraph = () => {
  const datepickerRef = useRef(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)

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

  const datePickerModalToggle = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDatePickerOpen((pre) => !pre)
  }

  useOnClickOutside(datepickerRef, () => setIsDatePickerOpen(false))

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
    // add 1 day to include endDate
    return differenceInDays(second, first) + 1
  }
  const daysOfInterval = eachDayOfInterval({
    start: startDate,
    end: endDate
  })
  const lineDataset = daysOfInterval.map((date) => {
    const matchedEarnings = graphData.filter((earning) =>
      isSameDay(new Date(earning.createdAt), new Date(date))
    )

    if (matchedEarnings[0]) {
      return matchedEarnings[0].amount
    }
  })

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="relative flex w-fit flex-col gap-[8px] rounded-[6px] border border-solid border-passes-gray bg-[#100C11] p-[10px]">
        <h3 className="text-2xl font-bold">
          {dateDiff(startDate, endDate)} Days
        </h3>
        <label
          className="flex cursor-pointer flex-row items-end gap-[24px] font-bold text-[#767676]"
          htmlFor="calender-modal"
          onClick={datePickerModalToggle}
          onMouseDown={(e) => e.stopPropagation()}
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
              <div className="earnings-date-picker w-fit" ref={datepickerRef}>
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

      <div className="w-full">
        <Line
          className="rounded-lg border border-passes-gray-600 bg-passes-black p-4"
          data={{
            labels: daysOfInterval.map((date) => date.toLocaleDateString()),
            datasets: [
              {
                showLine: true,
                fill: false,
                borderColor: "#9C4DC1",
                pointBackgroundColor: "#9C4DC1",
                data: lineDataset
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
