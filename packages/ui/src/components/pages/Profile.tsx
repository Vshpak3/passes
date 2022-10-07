import { FC } from "react"
import NoProfile from "src/components/organisms/NoProfile"
import ProfileContent from "src/components/organisms/profile/main-content/ProfileContent"
import PassTypes from "src/components/organisms/profile/passes/PassTypes"
import ProfileDetails from "src/components/organisms/profile/profile-details/ProfileDetails"
import { useCreatorProfile } from "src/hooks"

const Profile: FC = () => {
  const {
    creatorPasses,
    creatorStats,
    editProfile,
    fanWallPosts,
    isLoadingProfile,
    mutatePosts,
    onCloseEditProfile,
    onEditProfile,
    onSubmitEditProfile,
    ownsProfile,
    posts,
    profile,
    profileUsername
  } = useCreatorProfile()

  return (
    <>
      {isLoadingProfile ? (
        <></>
      ) : !profile ? (
        <NoProfile />
      ) : (
        <div className="mx-auto grid w-full grid-cols-10 px-4 sm:w-[653px] md:w-[653px] md:gap-5 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-10 w-full md:space-y-6 lg:col-span-7 lg:max-w-[680px]">
            <ProfileDetails
              profile={profile}
              username={profileUsername!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
              ownsProfile={ownsProfile}
              creatorStats={creatorStats!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
              editProfile={editProfile}
              onEditProfile={onEditProfile}
              onCloseEditProfile={onCloseEditProfile}
              onSubmitEditProfile={onSubmitEditProfile}
            />
            <ProfileContent
              profile={profile}
              ownsProfile={ownsProfile}
              posts={posts}
              mutatePosts={mutatePosts}
              fanWallPosts={fanWallPosts}
              profileUsername={profileUsername!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
            />
          </div>
          <div className="col-span-10 w-full md:space-y-6 lg:col-span-3 lg:max-w-[280px] lg:pt-7">
            <PassTypes creatorPasses={creatorPasses} />
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
