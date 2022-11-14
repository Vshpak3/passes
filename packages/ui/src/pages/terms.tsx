import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { TermsOfService } from "src/components/pages/TermsOfService"

const TermsOfServicePage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <TermsOfService />
    </Suspense>
  )
}

export default TermsOfServicePage // no WithNormalPageLayout
