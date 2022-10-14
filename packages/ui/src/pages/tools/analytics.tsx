import { CreatorStatsApi } from "@passes/api-client"
import { NextPage } from "next"
import { useState } from "react"
import { TabButton } from "src/components/atoms/Button"
import { AnalyticsHeader } from "src/components/pages/tools/analytics/AnalyticsHeader"
import { EarningsGraph } from "src/components/pages/tools/analytics/EarningsGraph"
import { MessageStatistics } from "src/components/pages/tools/analytics/MessageStatistics"
import { PostStatistics } from "src/components/pages/tools/analytics/PostStatistics"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"
import useSWR from "swr"

const Analytics: NextPage = () => {
  const [analyticsTab, setAnalyticsTab] = useState("earnings")
  const { data: userBalance } = useSWR("/creator-stats/balance", async () => {
    const api = new CreatorStatsApi()
    return await api.getAvailableBalance()
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
      {analyticsTab === "earnings" && (
        <EarningsGraph userBalance={userBalance?.amount} />
      )}
      {analyticsTab === "posts" && <PostStatistics />}

      {analyticsTab === "messages" && <MessageStatistics />}
    </div>
  )
}

const ANALYTICS_OPTIONS = [
  {
    label: "Earnings",
    value: "earnings"
  },
  {
    label: "Posts",
    value: "posts"
  },
  {
    label: "Messages",
    value: "messages"
  }
]

export default WithNormalPageLayout(Analytics, { creatorOnly: true })
