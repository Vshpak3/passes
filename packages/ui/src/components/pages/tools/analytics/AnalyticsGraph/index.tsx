import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import {
  CreatorEarningDto,
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
import React from "react"
import { Line } from "react-chartjs-2"
import { DateRangePicker } from "react-date-range"
import { TabButton } from "src/components/atoms/Button"
import { formatCurrency, getFormattedDate } from "src/helpers"
import Caret from "src/icons/caret"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface IEarningsGraph {
  userBalance?: number
}

const EarningsGraph: React.FC<IEarningsGraph> = ({
  userBalance
}: IEarningsGraph) => {
  const [activeTab, setActiveTab] = React.useState("total")
  const [dateRange, setDateRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  })
  const [graphData, setGraphData] = React.useState<Array<CreatorEarningDto>>([])

  const handleOnTabClick = (value: string) => {
    setActiveTab(value)
  }
  const api = new CreatorStatsApi()

  const fetchEarnings = React.useCallback(async () => {
    const data = await api.getHistoricEarnings({
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
    return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="flex flex-col  gap-[32px]">
      <div className="flex flex-col  gap-[8px]">
        <h3 className="text-2xl font-bold">
          Last {dateDiff(dateRange.startDate, dateRange.endDate)} Days
        </h3>
        <label
          htmlFor="calender-modal"
          className="modal-button flex cursor-pointer flex-row items-end gap-[24px] text-base font-bold"
        >
          {getFormattedDate(dateRange.startDate)} -{" "}
          {getFormattedDate(dateRange.endDate)}
          <Caret height={15} width={15} />
        </label>
        <input type="checkbox" id="calender-modal" className="modal-toggle" />
        <label htmlFor="calender-modal" className="modal cursor-pointer">
          <label
            className="modal-box relative flex items-center justify-center bg-[#fff]"
            htmlFor=""
          >
            <DateRangePicker
              ranges={[dateRange]}
              onChange={(newRange) => {
                setDateRange(newRange.selection as any)
              }}
            />
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
          className="rounded-[20px] border border-[#FFFFFF26] bg-[#1B141D80] p-4"
        />
      </div>
    </div>
  )
}

const EARNINGS_GRAPH_TABS = [
  {
    label: "All",
    id: uniqueId(),
    value: "total"
  },
  {
    label: "Subscriptions",
    id: uniqueId(),
    value: "subscriptions"
  },
  {
    label: "Tips",
    id: uniqueId(),
    value: "tips"
  },
  {
    label: "Posts",
    id: uniqueId(),
    value: "posts"
  },
  {
    label: "Messages",
    id: uniqueId(),
    value: "messages"
  },
  {
    label: "Streams",
    id: uniqueId(),
    value: "others"
  }
]

export default EarningsGraph
