import dynamic from "next/dynamic"
import { Suspense } from "react"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Profile = dynamic(() => import("src/components/pages/Profile"), {
  suspense: true,
  ssr: false
})

const ProfilePage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <Profile />
    </Suspense>
  )
}

export default WithNormalPageLayout(ProfilePage, { skipAuth: true })
