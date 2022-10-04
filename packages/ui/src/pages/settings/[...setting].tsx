import { useRouter } from "next/router"
import { withPageLayout } from "src/layout/WithPageLayout"

import { SettingsWrapper } from "./index"

const SettingPageWithParam = () => {
  const router = useRouter()

  if (!router.isReady) {
    return null
  }

  const _path = router.query.setting
  const path = _path ? (Array.isArray(_path) ? _path : [_path]) : []
  return <SettingsWrapper settingsPath={path} />
}

export default withPageLayout(SettingPageWithParam, { header: false })
