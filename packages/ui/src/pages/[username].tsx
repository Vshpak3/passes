import { GetProfileResponseDto, PassDto, ProfileApi } from "@passes/api-client"
import { UserApi } from "@passes/api-client/apis"
import { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import { useState } from "react"
import { toast } from "react-toastify"
import MainContent from "src/components/pages/profile/main-content"
import Passes from "src/components/pages/profile/passes"
import ProfileDetails from "src/components/pages/profile/profile-details"
import { EditProfile } from "src/components/pages/profile/profile-details/edit-profile"
import getConnection from "src/helpers/demo"
import { uploadFile } from "src/helpers/uploadFile"
import { wrapApi } from "src/helpers/wrapApi"
import { useCreatorProfile, usePasses, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const mockCreator = {
  id: "@drachnik",
  userId: "@drachnik",
  displayName: "Alex Drachnik",
  coverTitle: "DRACHNIK (SASHA)",
  coverDescription:
    "I help brands & DJs go viral on TikTok 📲 | Creative Director @ BAM 💥 | TikTok; 2M+",
  isKYCVerified: false,
  description: "Viral Tiktok Marketer. 2M+ followers",
  profileImageUrl: "/pages/profile/profile-photo.png",
  profileCoverImageUrl: "/pages/profile/profile-cover-photo.png",
  instagramUrl: "drachnik",
  tiktokUrl: "@drachnik",
  youtubeUrl: "AlexDrachnikFit",
  discordUrl: "AlexDrachnik",
  twitchUrl: "",
  facebookUrl: "AlexDrachnikCreator",
  twitterUrl: "drachnik",
  postsCount: 12,
  likes: 22900,
  isVerified: true,
  isActive: true,
  passes: [
    {
      title: "Basic Supporter",
      description:
        "See exclusive content at my most basic tier. I give broad advice to help your brand.",
      imgUrl: "/pages/profile/pass-example-1.png",
      type: "Free",
      price: 0,
      id: "pass_0"
    },
    {
      title: "Monthly Ambassador",
      description: `You'll get to see exclusive tips and tricks on how I make viral tiktoks for myself and others. And I'll guarantee *3* free reponses to DMs per month.`,
      imgUrl: "/pages/profile/pass-example-2.png",
      type: "Monthly",
      price: 20,
      id: "pass_1"
    },
    {
      title: "Lifetime Pass",
      description:
        "All the perks of the monthly pass for life. You'll get even more exclusive content, access to in-person workshops, and more. ",
      imgUrl: "/pages/profile/pass-example-3.png",
      type: "Lifetime",
      price: 2000,
      id: "pass_2"
    }
  ],
  posts: [
    {
      numLikes: 1400,
      numComments: 338,
      sharesCount: 220,
      locked: true,
      price: 32,
      date: "2022-07-23T19:00:00.000Z",
      caption:
        "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",

      content: [
        { url: "/pages/profile/profile-post-photo.png", type: "image/jpeg" }
      ]
    },
    {
      numLikes: 40,
      numComments: 10,
      sharesCount: 5,
      goal: 100000,
      collectedAmount: 75000,
      donationTypes: [10, 25, 50],
      numberOfDonations: 456,
      date: "2022-07-23T19:00:00.000Z",
      caption:
        "Tip $10 to get a video of me sharing my best tricks. Tip $25 to get a video and be able to ask a question that I’ll answer. Or tip $50 and I will make a custom video answering your question!",
      fundraiser: true,
      imgUrl: "/pages/profile/profile-post-photo.png",
      content: [
        {
          url: "/pages/profile/fundraiser1.png",
          type: "image/jpeg"
        },
        {
          url: "/pages/profile/fundraiser2.png",
          type: "image/jpeg"
        }
      ]
    }
  ]
}

const Username = (props: GetProfileResponseDto) => {
  const router = useRouter()
  const {
    query: { username: _username }
  } = router
  const username = _username as string
  const [editProfile, setEditProfile] = useState(false)
  const [profile, setProfile] = useState(props)
  const { creatorPasses } = usePasses(profile.userId)
  const onEditProfile = () => {
    setEditProfile(true)
  }
  const { user: { username: loggedInUsername } = {} } = useUser()
  const ownsProfile = loggedInUsername === username
  const { posts = [] } = useCreatorProfile({ username })

  const onSubmit = async (values: Record<string, any>) => {
    const { profileImage, profileCoverImage, ...rest } = values
    const [profileImageUrl, profileCoverImageUrl] = await Promise.all(
      [profileImage, profileCoverImage].map((files) => {
        if (!files?.length) return Promise.resolve(undefined)
        const file = files[0]
        return uploadFile(file, "profile")
      })
    )
    const newValues = { ...rest }
    newValues.fullName = values.firstName + " " + values.lastName
    if (profileImageUrl) newValues.profileImageUrl = profileImageUrl
    if (profileCoverImageUrl)
      newValues.profileCoverImageUrl = profileCoverImageUrl
    setProfile(newValues as any)
    const api = wrapApi(ProfileApi)
    await api.profileUpdate({
      id: props.id,
      updateProfileRequestDto: {
        ...rest,
        profileImageUrl: profileImageUrl ?? rest.profileImageUrl,
        profileCoverImageUrl: profileCoverImageUrl ?? rest.profileCoverImageUrl
      }
    })
    setEditProfile(false)

    if (rest.username !== username) await updateUsername(rest.username)
  }

  const updateUsername = async (username: string) => {
    const api = wrapApi(UserApi)
    await api.userSetUsername({
      updateUsernameRequestDto: {
        username
      }
    })
    router.replace("/" + username, undefined, { shallow: true })
  }

  // when the profile not found
  if (Object.keys(profile).length === 0) {
    return (
      <div className="flex w-full items-center justify-center pt-[60px]">
        <div className="flex w-[500px] flex-col items-center justify-center gap-[15px] text-center">
          <div className="h-[56px] w-[56px]">
            <LogoSmall />
          </div>
          <h1 className="mt-4 text-[32px] font-bold leading-[42px] text-white">
            Profile does not exist
          </h1>
          <span className="font-base text-[16px] leading-6 text-[#ffffff] opacity-50">
            The profile you are looking for may have expired or been removed. If
            you typed the address, double-check the spelling.
          </span>
          <Link href="/home">
            <span className="cursor-pointer text-base font-medium leading-6 text-passes-primary-color">
              Back to Passes home
            </span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0  sidebar-collapse:w-[1000px]">
        <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
          {profile?.id && (
            <ProfileDetails
              profile={profile}
              onEditProfile={onEditProfile}
              username={username}
              ownsProfile={ownsProfile}
            />
          )}
          {editProfile && <EditProfile profile={profile} onSubmit={onSubmit} />}
          {profile?.id && (
            <MainContent
              profile={profile}
              ownsProfile={ownsProfile}
              posts={posts}
              username={username}
            />
          )}
        </div>
        <div className="col-span-10 w-full pt-7 md:space-y-6 lg:col-span-3 lg:max-w-[280px]">
          {/* passes here */}
          {profile?.id && (
            <Passes
              creatorPasses={
                username !== "test"
                  ? creatorPasses
                  : (mockCreator.passes as unknown as PassDto[])
              }
            />
          )}
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.username) return { props: {} }
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username
  if (username === "test") return { props: mockCreator }
  const connection = await getConnection()
  const collection = connection.db("test").collection("creators")
  const { _id, ...props } =
    (await collection.findOne({ userId: username })) || {}
  if (_id)
    return { props: { ...props, id: _id.toString(), userId: "@" + username } }

  try {
    const api = new ProfileApi()
    const profile = await api.profileFindOneByUsername({ username })
    // TODO: Hack to remove undefined from generated API typings
    const props = { ...JSON.parse(JSON.stringify(profile)), username }
    return {
      props,
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 5 minutes
      revalidate: 5 * 60 // In seconds
    }
  } catch (err: any) {
    toast.error(err)
    console.log("Error found", err)
    return { props: {} }
  }
}
export default withPageLayout(Username)
