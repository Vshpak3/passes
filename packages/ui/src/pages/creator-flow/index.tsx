import dynamic from "next/dynamic"
import { Suspense } from "react"

const CreatorFlowMain = dynamic(
  () => import("src/components/pages/creator-flow/Main"),
  { suspense: true, ssr: false }
)

const CreatorFlowPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <CreatorFlowMain />
    </Suspense>
  )
}

export default CreatorFlowPage
