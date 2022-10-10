import dynamic from "next/dynamic"
import { Suspense } from "react"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

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

export default WithNormalPageLayout(CreatorFlowPage, {
  header: false,
  sidebar: false
})
