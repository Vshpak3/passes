import { FC, memo, useCallback, useContext, useEffect } from "react"

import { Loader } from "src/components/atoms/Loader"
import { NoProfile } from "src/components/organisms/NoProfile"
import { ProfileContent } from "src/components/organisms/profile/main-content/ProfileContent"
import { ProfileNavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { PassesSidebar } from "src/components/organisms/profile/passes/PassesSidebar"
import { ProfileDetails } from "src/components/organisms/profile/profile-details/ProfileDetails"
import { ContentService } from "src/helpers/content"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { ProfileContext } from "src/pages/[username]"

const ProfileUnmemo: FC = () => {
  const { profile, profileUserId, loadingProfile, hasInitialFetch } =
    useContext(ProfileContext)

  const updateProfileBanner = useCallback(async () => {
    if (!profileUserId) {
      return
    }
    const profileBanner = ContentService.profileBanner(profileUserId)
    const res = await fetch(profileBanner)
    if (res.status === 404) {
      return
    }
    const cover = document
      .getElementsByClassName("cover-image")
      .item(0) as HTMLDivElement
    if (!cover) {
      return
    }
    cover.style.backgroundImage = `url('${profileBanner}')`
  }, [profileUserId])

  useEffect(() => {
    updateProfileBanner()
  }, [profileUserId, updateProfileBanner])

  const { isTablet } = useWindowSize()
  if (isTablet === undefined) {
    return null
  }

  return (
    <>
      {!profile && loadingProfile ? (
        <div className="pt-28">
          <Loader />
        </div>
      ) : profile ? (
        <div className="grid grid-cols-7">
          <div className="col-span-7 pt-0 md:space-y-6 lg:col-span-4">
            <ProfileDetails />
            {!!profile.isCreator && (
              <ProfileContent
                tab={window.location.hash.slice(1) as ProfileNavigationOptions}
              />
            )}
          </div>
          {!isTablet && (
            <div className="sticky col-span-3 flex min-h-screen flex-col border-l-[0.5px] border-passes-gray">
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
