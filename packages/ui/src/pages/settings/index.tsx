import AuthOnlyWrapper from "src/components/wrappers/AuthOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

import SettingsNav from "./SettingsNav"

const Settings = () => {
  return (
    <AuthOnlyWrapper isPage>
      <SettingsNav />
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(Settings)
