import { useRouter } from "next/router"
import React from "react"
import { TabsEnum } from "src/config/settings"
import { withPageLayout } from "src/layout/WithPageLayout"

import { SettingsWrapper } from "./index"

const determineDefaultTab = (path: string): TabsEnum => {
  switch (path) {
    case "account":
      return TabsEnum.AccountSettings
    case "chat":
      return TabsEnum.ChatSettings
    case "notifications":
      return TabsEnum.NotificationEmailSettings
    case "privacy":
      return TabsEnum.PrivacySafetySettings
    case "payment":
      return TabsEnum.PaymentSettings
    case "wallet":
      return TabsEnum.WalletSettings
    case "payout":
      return TabsEnum.PayoutSettings
    // Return first tab if invalid
    default:
      return TabsEnum.AccountSettings
  }
}

export const determineTabPath = (tab: TabsEnum): string => {
  switch (tab) {
    case TabsEnum.AccountSettings:
      return "account"
    case TabsEnum.ChatSettings:
      return "chat"
    case TabsEnum.NotificationEmailSettings:
      return "notifications"
    case TabsEnum.PrivacySafetySettings:
      return "privacy"
    case TabsEnum.PaymentSettings:
      return "payment"
    case TabsEnum.WalletSettings:
      return "wallet"
    case TabsEnum.PayoutSettings:
      return "payout"
    default:
      return ""
  }
}

const SettingPageWithParam = () => {
  const router = useRouter()

  if (!router.isReady) {
    return null
  }

  const path = router.query.setting?.length ? router.query.setting[0] : ""
  const tab = determineDefaultTab(path)

  return <SettingsWrapper defaultTab={tab} />
}

export default withPageLayout(SettingPageWithParam, { header: false })
