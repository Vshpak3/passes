import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthWrapper from "src/components/wrappers/AuthWrapper"

const CreatorFlowMain = dynamic(
  () => import("src/components/pages/creator-flow/Main"),
  { suspense: true, ssr: false }
)

const CreatorFlowPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <AuthWrapper isPage>
        <CreatorFlowMain />
      </AuthWrapper>
    </Suspense>
  )
}

export default CreatorFlowPage
