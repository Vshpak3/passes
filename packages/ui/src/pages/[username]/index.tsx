import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import NoProfile from "src/components/organisms/NoProfile"
import PassTypes from "src/components/organisms/profile/passes/PassTypes"
import ProfileDetails from "src/components/organisms/profile/profile-details"
import { useCreatorProfile } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const EditProfile = dynamic(
  () => import("src/components/organisms/profile/profile-details/edit-profile"),
  { ssr: false }
)
const MainContent = dynamic(
  () => import("src/components/organisms/profile/main-content"),
  { ssr: false }
)

const Profile = () => {
  const {
    creatorPasses,
    editProfile,
    fanWallPosts,
    onEditProfile,
    onSubmitEditProfile,
    ownsProfile,
    posts,
    profile,
    profileUsername,
    onCloseEditProfile,
    creatorStats,
    mutatePosts,
    isLoading
  } = useCreatorProfile()
  const [isDeletedPost, setIsDeletedPost] = useState(false)

  useEffect(() => {
    if (isDeletedPost) {
      mutatePosts()
      return setIsDeletedPost(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedPost])

  if (isLoading) {
    return <></>
  }
  if (!profile || Object.keys(profile).length === 0) {
    return <NoProfile />
  }
  return (
    <div className="mx-auto grid w-full grid-cols-10 px-4 sm:w-[653px] md:w-[653px] md:gap-5 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="col-span-10 w-full md:space-y-6 lg:col-span-7 lg:max-w-[680px]">
        {profile?.profileId && (
          <ProfileDetails
            profile={profile}
            onEditProfile={onEditProfile}
            username={profileUsername}
            ownsProfile={ownsProfile}
            creatorStats={creatorStats}
          />
        )}
        {editProfile && (
          <EditProfile
            profile={profile}
            onSubmit={onSubmitEditProfile}
            onCloseEditProfile={onCloseEditProfile}
          />
        )}
        {profile?.profileId && (
          <MainContent
            profile={profile}
            ownsProfile={ownsProfile}
            posts={posts}
            mutatePosts={mutatePosts}
            setIsDeletedPost={setIsDeletedPost}
            fanWallPosts={fanWallPosts}
            profileUsername={profileUsername ?? ""}
          />
        )}
      </div>
      <div className="col-span-10 w-full md:space-y-6 lg:col-span-3 lg:max-w-[280px] lg:pt-7">
        {/* pass types here */}
        {profile?.profileId && <PassTypes creatorPasses={creatorPasses} />}
      </div>
    </div>
  )
}

export default withPageLayout(Profile, { skipAuth: true })
