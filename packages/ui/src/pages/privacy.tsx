import dynamic from "next/dynamic"
import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"

const PrivacyPolicy = dynamic(() => import("src/components/pages/Privacy"), {
  suspense: true
  // ssr: false
})

const PrivacyPolicyPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <PrivacyPolicy />
    </Suspense>
  )
}

export default PrivacyPolicyPage // no WithNormalPageLayout
