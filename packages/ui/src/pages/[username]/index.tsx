import dynamic from "next/dynamic"
import { memo, Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { PassesSidebar } from "src/components/organisms/profile/passes/PassesSidebar"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Profile = dynamic(() => import("src/components/pages/Profile"), {
  suspense: true,
  ssr: false
})

const ProfilePage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Profile />
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(ProfilePage), {
  skipAuth: true,
  header: false,
  sideContent: <PassesSidebar />
})
