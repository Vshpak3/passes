import dynamic from "next/dynamic"
import { Suspense } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

const Admin = dynamic(() => import("src/components/pages/admin"), {
  suspense: true,
  ssr: false
})

const AdminPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <Admin />
    </Suspense>
  )
}

export default withPageLayout(AdminPage, { header: false, sidebar: false })
