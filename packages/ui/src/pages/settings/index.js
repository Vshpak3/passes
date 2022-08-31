import { useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import SettingsNav from "./SettingsNav"

const Settings = () => {
  const user = useUser()
  console.log(user)
  return (
    <>
      <SettingsNav />
    </>
  )
}

export default withPageLayout(Settings)
