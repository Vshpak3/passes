import {
  CreatorEarningDto,
  CreatorStatsApi,
  GetCreatorEarningsHistoryRequestDtoTypeEnum
} from "@passes/api-client"
import { uniqueId } from "lodash"
import dynamic from "next/dynamic"
import ArrowDownRight from "public/icons/arrow-down-right.svg"
import ArrowUpRight from "public/icons/arrow-up-right.svg"
import ChevronLeft from "public/icons/chevron-left-bold-icon.svg"
import { useEffect, useState } from "react"
import { TabButton } from "src/components/atoms/Button"
import { Balance } from "src/components/atoms/performance/Balance"
import { FilterByDays } from "src/components/molecules/performance/FilterByDays"
import { Header } from "src/components/molecules/performance/Header"
import { Table } from "src/components/molecules/performance/Table"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import useSWR from "swr"

const Chart = dynamic(
  () =>
    import("src/components/molecules/performance/Chart").then((m) => m.Chart),
  { ssr: false }
)

const PERFORMANCE_OPTIONS = [
  {
    label: "All",
    value: "total",
    id: uniqueId()
  },
  {
    label: "Balance",
    value: "balance",
    id: uniqueId()
  },
  {
    label: "Subscription",
    value: "subscription",
    id: uniqueId()
  },
  {
    label: "Tips",
    value: "tips",
    id: uniqueId()
  },
  {
    label: "Lifetime",
    value: "lifetime",
    id: uniqueId()
  },
  {
    label: "Other",
    value: "other",
    id: uniqueId()
  }
]

const Performance = () => {
  const { data: userBalance } = useSWR("/creator-stats/balance", async () => {
    const api = new CreatorStatsApi()
    return await api.getBalance()
  })
  const [activeTab, setActiveTab] = useState("total")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  })
  const [graphData, setGraphData] = useState<CreatorEarningDto[]>([])

  useEffect(() => {
    const fetchEarnings = async () => {
      const api = new CreatorStatsApi()
      const data = await api.getEarningsHistory({
        getCreatorEarningsHistoryRequestDto: {
          start: dateRange.startDate,
          end: dateRange.endDate,
          type: activeTab as GetCreatorEarningsHistoryRequestDtoTypeEnum
        }
      })
      setGraphData(data.earnings)
    }

    fetchEarnings()
  }, [activeTab, dateRange])

  return (
    <>
      <Header />
      <div className="relative mx-auto max-w-[1100px] px-5 pt-6 pb-16 sidebar-collapse:px-9">
        <button className="flex items-center space-x-3 xs:space-x-5">
          <ChevronLeft />
          <span className="text-xl font-bold leading-6 xs:text-2xl">
            Performance Dashboard
          </span>
        </button>

        <Balance balance={userBalance?.amount} />

        <ul className="mt-5 flex space-x-[15px] overflow-auto lg:mt-12">
          <li>
            <TabButton variant="tab">All</TabButton>
          </li>

          <li>
            <TabButton variant="tab" active>
              Posts
            </TabButton>
          </li>

          <li>
            <TabButton variant="tab">Messages</TabButton>
          </li>
        </ul>

        <FilterByDays dateRange={dateRange} setDateRange={setDateRange} />

        <ul className="mt-5 flex space-x-[15px] overflow-auto lg:mt-6">
          {PERFORMANCE_OPTIONS.map(({ id, value, label }) => (
            <li key={id}>
              <TabButton
                onClick={() => setActiveTab(value)}
                active={activeTab === value}
                variant="tab"
              >
                {label}
              </TabButton>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center space-x-3 overflow-auto lg:mt-[30px]">
          <p className="text-2xl font-bold leading-6">$20,001.89</p>
          <div className="text-label flex items-center space-x-[3px] rounded-[56px] bg-passes-green/[0.17] py-1.5 px-3 text-passes-green">
            <span>3%</span>
            <ArrowUpRight />
          </div>
          <div className="text-label flex items-center space-x-[3px] rounded-[56px] bg-passes-red/[0.17] py-1.5 px-3 text-passes-red">
            <span>3%</span>
            <ArrowDownRight />
          </div>
        </div>

        <Chart graphData={graphData} />

        <Table graphData={graphData} />
      </div>
    </>
  )
}

export default WithNormalPageLayout(Performance, {
  creatorOnly: false,
  header: false
})
