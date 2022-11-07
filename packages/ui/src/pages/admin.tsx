import dynamic from "next/dynamic"
import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Admin = dynamic(() => import("src/components/pages/Admin"), {
  suspense: true
  // ssr: false
})

const AdminPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Admin />
    </Suspense>
  )
}

export default WithNormalPageLayout(AdminPage, {
  header: false,
  sidebar: false
})
