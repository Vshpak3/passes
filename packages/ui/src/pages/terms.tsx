import dynamic from "next/dynamic"
import { Suspense } from "react"
import { CenterLoader } from "src/components/atoms/CenterLoader"

const TermsOfService = dynamic(() => import("src/components/pages/Terms"), {
  suspense: true,
  ssr: false
})

const TermsOfServicePage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <TermsOfService />
    </Suspense>
  )
}

export default TermsOfServicePage // no WithNormalPageLayout
