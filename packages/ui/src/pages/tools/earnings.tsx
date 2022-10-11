import { CreatorStatsApi } from "@passes/api-client"
import { NextPage } from "next"
import { useState } from "react"
import { TabButton } from "src/components/atoms/Button"
import { EarningsGraph } from "src/components/pages/tools/analytics/AnalyticsGraph"
import { AnalyticsHeader } from "src/components/pages/tools/analytics/AnalyticsHeader"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import useSWR from "swr"

const Analytics: NextPage = () => {
  const [analyticsTab, setAnalyticsTab] = useState("earnings")
  const { data: userBalance } = useSWR("/creator-stats/balance", async () => {
    const api = new CreatorStatsApi()
    return await api.getBalance()
  })
  const handleAnalyticsTabClick = (value: string) => {
    setAnalyticsTab(value)
  }

  return (
    <div className="-mt-[212px] flex flex-col gap-[24px] overflow-hidden bg-black p-6">
      <AnalyticsHeader balance={userBalance?.amount} />
      <div className="flex flex-row gap-[16px] overflow-hidden">
        {ANALYTICS_OPTIONS.map((tab) => (
          <TabButton
            variant="tab"
            key={tab.value}
            active={analyticsTab === tab.value}
            onClick={() => handleAnalyticsTabClick(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
      <EarningsGraph userBalance={userBalance?.amount} />
    </div>
  )
}

const ANALYTICS_OPTIONS = [
  {
    label: "Earnings",
    value: "earnings"
  },
  {
    label: "Payout requests",
    value: "payout-requests"
  },
  {
    label: "Chargebacks",
    value: "chargebacks"
  }
]

export default WithNormalPageLayout(Analytics, { creatorOnly: true })
