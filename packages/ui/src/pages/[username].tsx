import { GetProfileDto, ProfileApi } from "@moment/api-client"
import { GetStaticPaths, GetStaticProps } from "next"
import HomeIcon from "public/icons/home.svg"
import MessagesIcon from "public/icons/messages.svg"
import PassesIcon from "public/icons/passes.svg"
import SettingsIcon from "public/icons/settings.svg"
import SubscriptionsIcon from "public/icons/subscriptions.svg"

import BackgroundShapes from "/public/pages/profile/header-shapes-bg.svg"

import SideBar from "../components/common/Sidebar"

const navigation = [
  { name: "Home", href: "#", icon: HomeIcon, current: true },
  { name: "Messages", href: "#", icon: MessagesIcon, current: false },
  { name: "Passes", href: "#", icon: PassesIcon, current: false },
  { name: "Payments", href: "#", icon: SubscriptionsIcon, current: false },
  { name: "Subscriptions", href: "#", icon: SubscriptionsIcon, current: false },
  { name: "Settings", href: "#", icon: SettingsIcon, current: false }
]

const mockCreator = {
  id: "test",
  userId: "test",
  fullName: "Test User",
  isKYCVerified: false,
  description:
    "Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞",
  profileImageUrl: "/example/avatar.jpeg",
  isActive: true
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Username = (props: GetProfileDto) => {
  return (
    <>
      <div className="bg-[#1b141d]/80 md:flex ">
        <div className="absolute top-0 left-0 hidden h-[320px] overflow-hidden md:block">
          <div className="absolute h-full w-screen bg-[#1b141d]/50 backdrop-blur-[200px]"></div>
          <BackgroundShapes className="" />
          <div className="z-10 hidden md:block"></div>
        </div>
        <SideBar navigation={navigation} />
        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <main className="flex-1 p-8 lg:mt-[269px]">
            <div className="grid grid-cols-12 gap-4  ">
              <div className="order-1 col-span-12  lg:col-span-3">Profile</div>
              <div className="order-3 col-span-12  lg:order-2 lg:col-span-6">
                Profile Content
              </div>
              <div className="order-2 col-span-12  lg:order-3 lg:col-span-3">
                Passes
              </div>
            </div>
          </main>
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
