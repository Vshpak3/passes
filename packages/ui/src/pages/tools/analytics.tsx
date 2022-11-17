import { NextPage } from "next"
import { useEffect, useState } from "react"

import { TabButton } from "src/components/atoms/button/TabButton"
import { AnalyticsHeader } from "src/components/pages/tools/analytics/AnalyticsHeader"
import { EarningsGraph } from "src/components/pages/tools/analytics/EarningsGraph"
import { MessageStatistics } from "src/components/pages/tools/analytics/MessageStatistics"
import { PostStatistics } from "src/components/pages/tools/analytics/PostStatistics"
import { useCreatorBalance } from "src/hooks/useAnalytics"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Analytics: NextPage = () => {
  let tab = window.location.hash.slice(1) as AnalyticsNavigationOptions
  if (!Object.values(AnalyticsNavigationOptions).includes(tab)) {
    tab = AnalyticsNavigationOptions.EARNINGS
  }

  const [analyticsTab, setAnalyticsTab] = useState(tab)
  const { userBalance } = useCreatorBalance()
  useEffect(() => {
    history.replaceState(window.history.state, "", `#${analyticsTab}`)
  }, [analyticsTab])

  const handleAnalyticsTabClick = (value: AnalyticsNavigationOptions) => {
    setAnalyticsTab(value)
  }

  return (
    <div className="my-4 flex flex-col gap-[24px] overflow-hidden px-6">
      <AnalyticsHeader balance={userBalance?.amount} />
      <div className="flex flex-row gap-[16px] overflow-hidden">
        {ANALYTICS_OPTIONS.map((tab) => (
          <TabButton
            active={analyticsTab === tab.value}
            className="rounded-[5px]"
            key={tab.value}
            label={tab.label}
            onClick={() => handleAnalyticsTabClick(tab.value)}
          />
        ))}
      </div>
      {analyticsTab === AnalyticsNavigationOptions.EARNINGS && (
        <EarningsGraph userBalance={userBalance?.amount} />
      )}
      {analyticsTab === AnalyticsNavigationOptions.POSTS && <PostStatistics />}

      {analyticsTab === AnalyticsNavigationOptions.MESSAGES && (
        <MessageStatistics />
      )}
    </div>
  )
}
enum AnalyticsNavigationOptions {
  EARNINGS = "earnings",
  POSTS = "posts",
  MESSAGES = "messages"
}

const ANALYTICS_OPTIONS = [
  {
    label: "Earnings",
    value: AnalyticsNavigationOptions.EARNINGS
  },
  {
    label: "Posts",
    value: AnalyticsNavigationOptions.POSTS
  },
  {
    label: "Messages",
    value: AnalyticsNavigationOptions.MESSAGES
  }
]

export default WithNormalPageLayout(Analytics, {
  creatorOnly: true,
  headerTitle: "Analytics"
})
