import { memo } from "react"

import { Wallets } from "src/components/organisms/wallets/Wallets"
import { Tab } from "src/components/pages/settings/Tab"

const WalletSettings = () => {
  return (
    <Tab title="Wallet Management & Settings" withBackMobile>
      <Wallets />
    </Tab>
  )
}

export default memo(WalletSettings) // eslint-disable-line import/no-default-export
