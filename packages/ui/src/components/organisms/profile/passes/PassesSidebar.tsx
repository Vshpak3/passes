import { useContext } from "react"

import { Loader } from "src/components/atoms/Loader"
import { ProfileContext } from "src/pages/[username]"
import { CreatorPinnedPasses } from "./CreatedPinnedPasses"

export const PassesSidebar = () => {
  const { profile, loadingProfile } = useContext(ProfileContext)

  return (
    <>
      {!profile && loadingProfile ? (
        <div className="pt-28">
          <Loader />
        </div>
      ) : (
        profile && !!profile?.isCreator && <CreatorPinnedPasses />
      )}
    </>
  )
}
