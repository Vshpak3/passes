import { Loader } from "src/components/atoms/Loader"
import { useProfile } from "src/hooks/profile/useProfile"
import { CreatorPinnedPasses } from "./CreatedPinnedPasses"

export const PassesSidebar = () => {
  const { profile, profileUserId, loadingProfile } = useProfile()

  return (
    <>
      {!profile && loadingProfile ? (
        <div className="pt-28">
          <Loader />
        </div>
      ) : (
        profile &&
        !!profile?.isCreator && (
          <CreatorPinnedPasses userId={profileUserId || ""} />
        )
      )}
    </>
  )
}
