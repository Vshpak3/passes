import dynamic from "next/dynamic"
import { Suspense } from "react"

const TermsOfService = dynamic(() => import("src/components/pages/terms"), {
  suspense: true,
  ssr: false
})

const TermsOfServicePage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <TermsOfService />
    </Suspense>
  )
}

export default TermsOfServicePage // no WithNormalPageLayout
