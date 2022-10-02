import dynamic from "next/dynamic"
import PassTypes from "src/components/pages/profile/passes/PassTypes"
import ProfileDetails from "src/components/pages/profile/profile-details"
import { useCreatorProfile } from "src/hooks"

import NoProfile from "../../components/organisms/NoProfile"
import { withPageLayout } from "../../layout/WithPageLayout"

const EditProfile = dynamic<any>(
  () =>
    import("src/components/pages/profile/profile-details/edit-profile").then(
      (mod) => mod.EditProfile
    ),
  {
    ssr: false
  }
)
const MainContent = dynamic<any>(
  () => import("src/components/pages/profile/main-content"),
  {
    ssr: false
  }
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
    username,
    onCloseEditProfile,
    creatorStats,
    isLoading
  } = useCreatorProfile()
  // when no profile is found
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
            username={username}
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
            fanWallPosts={fanWallPosts}
            username={username}
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

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: "blocking"
//   }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   if (!params || !params.username) {
//     return { props: {} }
//   }

//   const username = Array.isArray(params.username)
//     ? params.username[0]
//     : params.username

//   try {
//     const api = new ProfileApi()
//     const profile = await api.findProfile({
//       getProfileRequestDto: { username }
//     })
//     console.log(profile)

//     // Hack to remove undefined from generated API typings
//     const props = { ...JSON.parse(JSON.stringify({ ...profile })) }

//     return {
//       props,
//       // Next.js will attempt to re-generate the page:
//       // - When a request comes in
//       // - At most once every 5 minutes
//       revalidate: 5 * 60 // In seconds
//     }
//   } catch (err: any) {
//     return { props: {} }
//   }
// }
// export default withPageLayout(Profile, { skipAuth: true, header: true })

export default withPageLayout(Profile, { skipAuth: true, header: true })
