import { Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { Admin } from "src/components/pages/admin"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const AdminPage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Admin />
    </Suspense>
  )
}

export default WithNormalPageLayout(AdminPage, {
  header: false,
  sidebar: false,
  noScroll: true
})
