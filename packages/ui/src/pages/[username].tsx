import { GetProfileDto, ProfileApi } from "@moment/api-client"
import { GetStaticPaths, GetStaticProps } from "next"

import SideBar from "../components/common/Sidebar"
import ProfileDetails from "../components/pages/profile/profile-details"
const mockCreator = {
  id: "@drachnik",
  userId: "@drachnik",
  fullName: "Alex Drachnik",
  isKYCVerified: false,
  description: "Viral Tiktok Marketer. 2M+ followers",
  profileImageUrl: "/pages/profile/profile-photo.png",
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
  isActive: true
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Username = (props: GetProfileDto) => {
  return (
    <>
      <div className="relative flex min-h-screen flex-1 bg-[#1b141d]/80">
        <SideBar />
        <main className="bg-[#1B141D]/85 flex-shrink flex-grow">
          <div className="cover-image h-[300px]" />
          <div className="mx-auto -mt-[205px] grid w-full grid-cols-12 gap-5 px-4 md:w-[612px] lg:w-[900px] lg:px-0">
            <div className="col-span-12 w-full lg:col-span-4 lg:max-w-[280px]">
              <div className="">
                {props?.id && <ProfileDetails profile={props} />}
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Passes
                </div>
              </div>
            </div>
            <div className="col-span-12 w-full lg:col-span-8 lg:max-w-[620px] ">
              <div className="min-h-12 flex flex-col items-center rounded border ">
                Main Content
                <p className="p-20"> Main Content</p>
                <p className="p-20"> Main Content</p>
                <p className="p-20"> Main Content</p>
              </div>
            </div>
            <div className="hidden xl:col-span-1 xl:block"></div>
          </div>
        </main>
      </div>
    </>
  )
}
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const api = new ProfileApi()
    const res = (await api.profileGetAllUsernames()) as { usernames: string[] }
    return {
      paths: res?.usernames?.map((username) => ({ params: { username } })),
      fallback: true
    }
  } catch (error) {
    return {
      paths: [],
      fallback: true
    }
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
    return { props }
  } catch (err) {
    return { props: {} }
  }
}
export default Username
