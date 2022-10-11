import dynamic from "next/dynamic"
import { Suspense } from "react"

const PrivacyPolicy = dynamic(
  () => import("src/components/pages/Privacy").then((m) => m.PrivacyPolicy),
  {
    suspense: true,
    ssr: false
  }
)

const PrivacyPolicyPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <PrivacyPolicy />
    </Suspense>
  )
}

export default PrivacyPolicyPage // no WithNormalPageLayout
