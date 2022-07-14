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
        <div className="hidden md:block">
          <SideBar />
        </div>
        <div className="min-h-16 absolute top-0 left-0 flex w-full flex-1 items-center justify-between bg-[#252525]/50 px-2 backdrop-blur-lg md:hidden">
          <div>icon 1</div>
          <div>icon 2</div>
        </div>
        <div className="bg-[#1B141D]/85 w-full">
          <div className="cover-image h-[300px]" />
          <div className="-mt-[205px] w-full p-4">
            <div className="grid grid-cols-8 gap-4 ">
              <div className="col-span-8 grid grid-rows-2 gap-6 lg:col-span-2">
                {props?.id && <ProfileDetails profile={props} />}
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Passes
                </div>
              </div>
              <div className=" col-span-8 lg:col-span-6 xl:col-span-5">
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Main Content
                  <p className="p-20"> Main Content</p>
                  <p className="p-20"> Main Content</p>
                  <p className="p-20"> Main Content</p>
                </div>
              </div>
              <div className="hidden xl:col-span-1 xl:block"></div>
            </div>
          </div>
        </div>
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
