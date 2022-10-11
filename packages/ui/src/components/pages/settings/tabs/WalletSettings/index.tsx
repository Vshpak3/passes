import React from "react"
import { Wallets } from "src/components/organisms/wallets/wallets"
import { Tab } from "src/components/pages/settings/Tab"

export const WalletSettings = () => {
  return (
    <Tab withBackMobile title="Wallet Management & Settings">
      <Wallets />
    </Tab>
  )
}
