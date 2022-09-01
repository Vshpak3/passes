import { CreatorStatsApi } from "@passes/api-client"
import { uniqueId } from "lodash"
import { NextPage } from "next"
import React from "react"
import { TabButton } from "src/components/atoms/Button"
import EarningsGraph from "src/components/pages/tools/analytics/AnalyticsGraph"
import AnalyticsHeader from "src/components/pages/tools/analytics/AnalyticsHeader"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import { wrapApi } from "src/helpers"
import { withPageLayout } from "src/layout/WithPageLayout"
import useSWR from "swr"

const Analytics: NextPage = () => {
  const [analyticsTab, setAnalyticsTab] = React.useState("earnings")
  const { data: userBalance } = useSWR("/creator-stats/balance", async () => {
    const api = wrapApi(CreatorStatsApi)
    return await api.creatorStatsGetBalance()
  })
  const handleAnalyticsTabClick = (value: string) => {
    setAnalyticsTab(value)
  }

  return (
    <CreatorOnlyWrapper isPage>
      <div className="-mt-[212px] flex flex-col  gap-[24px] overflow-hidden bg-black p-6">
        <AnalyticsHeader balance={userBalance?.amount} />
        <div className="flex flex-row gap-[16px] overflow-hidden">
          {ANALYTICS_OPTIONS.map((tab) => (
            <TabButton
              variant="tab"
              key={tab.id}
              active={analyticsTab === tab.value}
              onClick={() => handleAnalyticsTabClick(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        <EarningsGraph userBalance={userBalance?.amount} />
      </div>
    </CreatorOnlyWrapper>
  )
}

const ANALYTICS_OPTIONS = [
  {
    label: "Earnings",
    value: "earnings",
    id: uniqueId()
  },
  {
    label: "Payout requests",
    value: "payout-requests",
    id: uniqueId()
  },
  {
    label: "Chargebacks",
    value: "chargebacks",
    id: uniqueId()
  },
  {
    label: "Referrals",
    value: "referrals",
    id: uniqueId()
  }
]

export default withPageLayout(Analytics)
