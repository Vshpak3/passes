import AuthOnlyWrapper from "src/components/wrappers/AuthOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

import Wallets from "./wallets"

const Settings = () => {
  return (
    <AuthOnlyWrapper isPage>
      <Wallets />
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(Settings)
