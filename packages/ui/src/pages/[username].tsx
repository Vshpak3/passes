import { GetProfileDto, ProfileApi } from "@moment/api-client"
import { GetStaticPaths, GetStaticProps } from "next"

import SideBar from "../components/common/Sidebar"
import MainContent from "../components/pages/profile/main-content"
import Passes from "../components/pages/profile/passes"
import ProfileDetails from "../components/pages/profile/profile-details"

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
  posts: 12,
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
      price: 0
    },
    {
      title: "Monthly Ambassador",
      description: `You'll get to see exclusive tips and tricks on how I make viral tiktoks for myself and others. And I'll guarantee *3* free reponses to DMs per month.`,
      imgUrl: "/pages/profile/pass-example-2.png",
      type: "Monthly",
      price: 20
    },
    {
      title: "Lifetime Pass",
      description:
        "All the perks of the monthly pass for life. You'll get even more exclusive content, access to in-person workshops, and more. ",
      imgUrl: "/pages/profile/pass-example-3.png",
      type: "Lifetime",
      price: 2000
    }
  ]
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Username = (props: GetProfileDto) => {
  return (
    <>
      <div className="relative flex min-h-screen flex-1 bg-[#1b141d]/80">
        <SideBar />
        <main className="bg-[#1B141D]/85 flex-shrink flex-grow">
          <div className="cover-image h-[300px]" />
          <div className="mx-auto -mt-[205px] grid w-full grid-cols-12 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0">
            <div className="col-span-12 w-full space-y-6 lg:col-span-4 lg:max-w-[280px]">
              {props?.id && <ProfileDetails profile={props} />}
              {props?.id && <Passes profile={props} />}
            </div>
            {props?.id && <MainContent profile={props} />}
            <div className="hidden xl:col-span-1 xl:block"></div>
          </div>
        </main>
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
export default Username
