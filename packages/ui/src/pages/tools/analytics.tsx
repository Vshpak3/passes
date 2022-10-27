import { NextPage } from "next"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { TabButton } from "src/components/atoms/Button"
import { AnalyticsHeader } from "src/components/pages/tools/analytics/AnalyticsHeader"
import { useCreatorBalance } from "src/hooks/useAnalytics"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const EarningsGraph = dynamic(
  () => import("src/components/pages/tools/analytics/EarningsGraph"),
  { ssr: false }
)
const MessageStatistics = dynamic(
  () => import("src/components/pages/tools/analytics/MessageStatistics"),
  { ssr: false }
)
const PostStatistics = dynamic(
  () => import("src/components/pages/tools/analytics/PostStatistics"),
  { ssr: false }
)

const Analytics: NextPage = () => {
  let tab = window.location.hash.slice(1) as AnalyticsNavigationOptions
  if (!Object.values(AnalyticsNavigationOptions).includes(tab)) {
    tab = AnalyticsNavigationOptions.EARNINGS
  }

  const [analyticsTab, setAnalyticsTab] = useState(tab)
  const { userBalance } = useCreatorBalance()
  useEffect(() => {
    history.replaceState(undefined, "", `#${analyticsTab}`)
  }, [analyticsTab])

  const handleAnalyticsTabClick = (value: AnalyticsNavigationOptions) => {
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

export default WithNormalPageLayout(Analytics, { creatorOnly: true })
