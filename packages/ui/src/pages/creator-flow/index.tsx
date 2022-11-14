import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { CreatorFlow } from "src/components/pages/creator-flow/Main"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const CreatorFlowPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <CreatorFlow />
    </Suspense>
  )
}

export default WithNormalPageLayout(CreatorFlowPage, {
  header: false,
  sidebar: false
})
