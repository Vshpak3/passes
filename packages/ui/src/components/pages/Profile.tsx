import { FC, memo } from "react"
import { Loader } from "src/components/atoms/Loader"
import { NoProfile } from "src/components/organisms/NoProfile"
import { ProfileContent } from "src/components/organisms/profile/main-content/ProfileContent"
import { PassTypes } from "src/components/organisms/profile/passes/PassTypes"
import { ProfileDetails } from "src/components/organisms/profile/profile-details/ProfileDetails"
import { useProfile } from "src/hooks/useProfile"

export const Profile: FC = () => {
  const { profileInfo, loadingProfileInfo, hasInitialFetch } = useProfile()
  return (
    <>
      {!profileInfo && loadingProfileInfo ? (
        <div className="pt-[100px]">
          <Loader />
        </div>
      ) : profileInfo ? (
        <div className="mx-auto grid w-full grid-cols-10 px-4 sm:w-[653px] md:w-[653px] md:gap-5 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-10 w-full md:space-y-6 lg:col-span-7 lg:max-w-[680px]">
            <ProfileDetails />
            {!!profileInfo.isCreator && <ProfileContent />}
          </div>
          <div className="col-span-10 w-full md:space-y-6 lg:col-span-3 lg:max-w-[280px] lg:pt-7">
            {!!profileInfo.isCreator && <PassTypes />}
          </div>
        </div>
      ) : (
        hasInitialFetch && <NoProfile />
      )}
    </>
  )
}

export default memo(Profile) // eslint-disable-line import/no-default-export
