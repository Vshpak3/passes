import { GetProfileResponseDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { createContext, memo, Suspense } from "react"
import { KeyedMutator } from "swr"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import { ProfileUpdate } from "src/helpers/updateProfile"
import { useProfile } from "src/hooks/profile/useProfile"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Profile = dynamic(() => import("src/components/pages/Profile"), {
  suspense: true
  // ssr: false
})

interface ProfileProps {
  profile: GetProfileResponseDto | undefined
  loadingProfile: boolean
  mutateProfile: KeyedMutator<GetProfileResponseDto>
  mutateManualProfile: (update: Partial<ProfileUpdate>) => void

  profileUsername: string | undefined
  profileUserId: string | undefined
  ownsProfile: boolean
  hasInitialFetch: boolean
}

export const ProfileContext = createContext({} as ProfileProps)

const ProfilePage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <ProfileContext.Provider value={useProfile()}>
        <Profile />
      </ProfileContext.Provider>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(ProfilePage), {
  skipAuth: true,
  header: true,
  headerClassName: "cover-image border-b-0 !h-[200px]"
})
