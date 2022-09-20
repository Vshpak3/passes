import SettingsNav from "src/components/organisms/settings/SettingsNav"
import AuthOnlyWrapper from "src/components/wrappers/AuthOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

const Settings = () => {
  return (
    <AuthOnlyWrapper isPage>
      <SettingsNav />
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(Settings)
