import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { CookiesPolicy } from "src/components/pages/Cookies"

const CookiesPolicyPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <CookiesPolicy />
    </Suspense>
  )
}

export default CookiesPolicyPage // no WithNormalPageLayout
