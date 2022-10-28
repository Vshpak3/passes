import dynamic from "next/dynamic"
import { memo, Suspense } from "react"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { PassTypes } from "src/components/organisms/profile/passes/PassTypes"
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
  sideContent: (
    <div className="flex flex-col px-4">
      <span className="py-5 text-lg font-bold">Creator&apos;s Passes</span>
      <PassTypes />
    </div>
  )
})
