import Wallets from "src/components/organisms/wallets/wallets"
import AuthOnlyWrapper from "src/components/wrappers/AuthOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

const Settings = () => {
  return (
    <AuthOnlyWrapper isPage>
      <Wallets />
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(Settings)
