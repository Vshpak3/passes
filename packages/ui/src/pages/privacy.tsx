import dynamic from "next/dynamic"
import { Suspense } from "react"

const PrivacyPolicy = dynamic(() => import("src/component/pages/privacy"), {
  suspense: true,
  ssr: false
})

const PrivacyPolicyPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <PrivacyPolicy />
    </Suspense>
  )
}

export default PrivacyPolicyPage
