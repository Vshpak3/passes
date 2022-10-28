import { FC, memo } from "react"

import { Loader } from "src/components/atoms/Loader"
import { NoProfile } from "src/components/organisms/NoProfile"
import { ProfileContent } from "src/components/organisms/profile/main-content/ProfileContent"
import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
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
        <div className="col-span-9 w-full pt-28 md:space-y-6 md:pt-0 lg:col-span-6">
          <div className="cover-image h-[200px] w-full pt-4"></div>
          <ProfileDetails />
          {!!profile.isCreator && (
            <ProfileContent
              tab={window.location.hash.slice(1) as ProfileNavigationOptions}
            />
          )}
          {/* <div className="col-span-2 hidden w-full md:flex md:space-y-6 lg:pt-7">
          {!!profile.isCreator && <PassTypes />}
        </div> */}
        </div>
      ) : (
        hasInitialFetch && <NoProfile />
      )}
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(ProfileUnmemo)
