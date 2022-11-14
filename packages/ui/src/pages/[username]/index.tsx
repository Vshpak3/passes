import { GetProfileResponseDto, PassDto, PostDto } from "@passes/api-client"
import { createContext, memo, Suspense } from "react"
import { KeyedMutator } from "swr"

import { CenterLoader } from "src/components/atoms/CenterLoader"
import ProfileUnmemo from "src/components/pages/Profile"
import { ProfileUpdate } from "src/helpers/updateProfile"
import { useProfile } from "src/hooks/profile/useProfile"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

interface ProfileProps {
  profile: GetProfileResponseDto | undefined
  loadingProfile: boolean
  mutateProfile: KeyedMutator<GetProfileResponseDto>
  mutateManualProfile: (update: Partial<ProfileUpdate>) => void

  profileUsername: string | undefined
  profileUserId: string | undefined
  ownsProfile: boolean
  hasInitialFetch: boolean

  pinnedPasses: PassDto[]
  pinPass: (pass: PassDto) => Promise<void>
  unpinPass: (pass: PassDto) => Promise<void>

  pinnedPosts: PostDto[]
  mutatePinnedPosts: KeyedMutator<PostDto[] | undefined>
  pinPost: (post: PostDto) => Promise<void>
  unpinPost: (post: PostDto) => Promise<void>
}

export const ProfileContext = createContext({} as ProfileProps)

const ProfilePage = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <ProfileContext.Provider value={useProfile()}>
        <ProfileUnmemo />
      </ProfileContext.Provider>
    </Suspense>
  )
}

export default WithNormalPageLayout(memo(ProfilePage), {
  skipAuth: true,
  header: false
})
