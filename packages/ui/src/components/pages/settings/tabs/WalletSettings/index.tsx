import React from "react"
import Wallets from "src/components/organisms/wallets/wallets"
import Tab from "src/components/pages/settings/Tab"

const WalletSettings = () => {
  return (
    <Tab withBack title="Wallet Management & Settings">
      <Wallets />
    </Tab>
  )
}

export default WalletSettings
