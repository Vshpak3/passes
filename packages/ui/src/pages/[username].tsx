import { GetProfileDto, ProfileApi } from "@passes/api-client"
import { GetStaticPaths, GetStaticProps } from "next"

import MainContent from "../components/pages/profile/main-content"
import Passes from "../components/pages/profile/passes"
import ProfileDetails from "../components/pages/profile/profile-details"
import { withPageLayout } from "../components/pages/WithPageLayout"
import { getConnection } from "../helpers/demo"

const mockCreator = {
  id: "@drachnik",
  userId: "@drachnik",
  fullName: "Alex Drachnik",
  coverTitle: "DRACHNIK (SASHA)",
  coverDescription:
    " I help brands & DJs go viral on TikTok 📲 | Creative Director @ BAM 💥 | TikTok; 2M+",
  isKYCVerified: false,
  description: "Viral Tiktok Marketer. 2M+ followers",
  profileImageUrl: "/pages/profile/profile-photo.png",
  profileCoverImageUrl: "/pages/profile/profile-cover-photo.png",
  instagramUrl: "drachnik",
  tiktokUrl: "@drachnik",
  youtubeUrl: "AlexDrachnikFit",
  discordUrl: "AlexDrachnik",
  twitchUrl: "drachnik",
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
      likesCount: 1400,
      commentsCount: 338,
      sharesCount: 220,
      locked: true,
      price: 32,
      date: "2022-07-23T19:00:00.000Z",
      caption:
        "I’m so excited to share EXACTLY how I made these TikToks for Insomniac go viral. I show how I experimented, the videos, and explain the process for making engaged Tiktoks.",
      imgUrl: "/pages/profile/profile-post-photo.png"
    },
    {
      likesCount: 40,
      commentsCount: 10,
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
      images: [
        "/pages/profile/fundraiser1.png",
        "/pages/profile/fundraiser2.png"
      ]
    }
  ]
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Username = (props: GetProfileDto) => {
  return (
    <>
      <div className="mx-auto -mt-[205px] grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0  sidebar-collapse:w-[1000px]">
        <div className="col-span-10 w-full space-y-6 lg:col-span-3 lg:max-w-[280px]">
          {props?.id && <ProfileDetails profile={props} />}
          {props?.id && <Passes profile={props} />}
        </div>
        <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
          {props?.id && <MainContent profile={props} />}
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

  const connection = await getConnection()
  const collection = connection.db("test").collection("creators")
  const { _id, ...props } =
    (await collection.findOne({ userId: username })) || {}
  if (_id)
    return { props: { ...props, id: _id.toString(), userId: "@" + username } }

  if (username === "test") return { props: mockCreator }
  try {
    const api = new ProfileApi()
    const profile = await api.profileFindOneByUsername({ username })
    // TODO: Hack to remove undefined from generated API typings
    const props = JSON.parse(JSON.stringify(profile))
    return {
      props,
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 5 minutes
      revalidate: 5 * 60 // In seconds
    }
  } catch (err) {
    return { props: {} }
  }
}
export default withPageLayout(Username)
