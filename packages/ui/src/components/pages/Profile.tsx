import { FC, memo } from "react"

import { Loader } from "src/components/atoms/Loader"
import { NoProfile } from "src/components/organisms/NoProfile"
import { ProfileContent } from "src/components/organisms/profile/main-content/ProfileContent"
import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { PassesSidebar } from "src/components/organisms/profile/passes/PassesSidebar"
import { ProfileDetails } from "src/components/organisms/profile/profile-details/ProfileDetails"
import { useProfile } from "src/hooks/profile/useProfile"

const ProfileUnmemo: FC = () => {
  const { profile, loadingProfile, hasInitialFetch } = useProfile()

  return (
    <>
      {!profile && loadingProfile ? (
        <div className="pt-28">
          <Loader />
        </div>
      ) : profile ? (
        <div className="grid grid-cols-7">
          <div className="col-span-7 pt-28 md:space-y-6 md:pt-0 lg:col-span-4">
            <ProfileDetails key={profile.userId} />
            {!!profile.isCreator && (
              <ProfileContent
                key={profile.userId}
                tab={window.location.hash.slice(1) as ProfileNavigationOptions}
              />
            )}
          </div>
          <div className="sticky col-span-3 flex min-h-screen flex-col border-l-[0.5px] border-gray-600">
            <PassesSidebar key={profile.userId} />
          </div>
        </div>
      ) : (
        hasInitialFetch && <NoProfile />
      )}
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(ProfileUnmemo)
