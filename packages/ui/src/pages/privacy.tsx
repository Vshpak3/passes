import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { PrivacyPolicy } from "src/components/pages/Privacy"

const PrivacyPolicyPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <PrivacyPolicy />
    </Suspense>
  )
}

export default PrivacyPolicyPage // no WithNormalPageLayout
