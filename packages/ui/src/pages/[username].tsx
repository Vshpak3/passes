import { GetProfileDto, ProfileApi } from "@moment/api-client"
import { GetStaticPaths, GetStaticProps } from "next"

import SideBar from "../components/common/Sidebar"
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
          <div className="-mt-10 w-full p-4">
            <div className="grid grid-cols-12 gap-4 md:grid-cols-10">
              <div className="hidden md:order-1 md:col-span-1 md:block"></div>
              <div className="order-1 col-span-12 md:order-2 md:col-span-2">
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Profile
                </div>
              </div>
              <div className="order-3 col-span-12 md:order-2 md:col-span-4">
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Main Content
                </div>
              </div>
              <div className="order-2 col-span-12 md:order-3 md:col-span-2">
                <div className="min-h-12 flex flex-col items-center rounded border">
                  Passes
                </div>
              </div>
              <div className="hidden md:order-4 md:col-span-1 md:block"></div>
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
