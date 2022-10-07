import dynamic from "next/dynamic"
import { Suspense } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

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

export default withPageLayout(ProfilePage, { skipAuth: true })
