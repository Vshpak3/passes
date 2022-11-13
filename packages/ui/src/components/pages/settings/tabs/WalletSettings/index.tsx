import { memo } from "react"

import { Wallets } from "src/components/organisms/wallets/Wallets"
import { Tab } from "src/components/pages/settings/Tab"

const WalletSettings = () => {
  return (
    <Tab isRootTab title="Wallet Management & Settings">
      <Wallets />
    </Tab>
  )
}

export default memo(WalletSettings) // eslint-disable-line import/no-default-export
