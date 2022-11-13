import { FC, memo, useContext, useState } from "react"

import { Loader } from "src/components/atoms/Loader"
import { NoProfile } from "src/components/organisms/NoProfile"
import { ProfileContent } from "src/components/organisms/profile/main-content/ProfileContent"
import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { PassesSidebar } from "src/components/organisms/profile/passes/PassesSidebar"
import { ProfileDetails } from "src/components/organisms/profile/profile-details/ProfileDetails"
import { ProfileBanner } from "src/components/organisms/profile/profile-details/ProfileHeader"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { ProfileContext } from "src/pages/[username]"

const ProfileUnmemo: FC = () => {
  const { profile, loadingProfile, hasInitialFetch } =
    useContext(ProfileContext)

  const [profileBannerOverride, setProfileBannerOverride] = useState<string>()

  const { isTablet } = useWindowSize()
  if (isTablet === undefined) {
    return null
  }

  return (
    <>
      <ProfileBanner profileBannerOverride={profileBannerOverride} />
      {!profile && loadingProfile ? (
        <div className="pt-28">
          <Loader />
        </div>
      ) : profile ? (
        <div className="grid grid-cols-7">
          <div className="col-span-7 pt-0 md:space-y-6 lg:col-span-4">
            <ProfileDetails
              setProfileBannerOverride={setProfileBannerOverride}
            />
            {!!profile.isCreator && (
              <ProfileContent
                tab={window.location.hash.slice(1) as ProfileNavigationOptions}
              />
            )}
          </div>
          {!isTablet && (
            <div className="min-safe-h-screen sticky col-span-3 flex flex-col border-l-[0.5px] border-passes-gray">
              <PassesSidebar />
            </div>
          )}
        </div>
      ) : (
        hasInitialFetch && <NoProfile />
      )}
    </>
  )
}

// eslint-disable-next-line import/no-default-export
export default memo(ProfileUnmemo)
