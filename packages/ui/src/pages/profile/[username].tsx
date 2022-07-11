import { ProfileApi } from "@moment/api-client"
import { GetStaticPaths, GetStaticProps } from "next"
import { useState } from "react"
import NavigationMenu from "src/components/navigation-menu/navigation-menu"
import AboutCreator from "src/components/pages/profile/about-creator"
import CreatorPosts from "src/components/pages/profile/posts/creator-posts"

import GrainyVector from "/public/pages/profile/grainy.svg"
import CenteredGradient from "/public/pages/profile/profile-bg-gradient-center.svg"
import CenteredLeftGradient from "/public/pages/profile/profile-bg-gradient-left.svg"

import ProfileAvatar from "../../components/common/ProfileAvatar"
import ProfileAvatarAdditionalInformation from "../../components/common/ProfileAvatar/ProfileAvatarAdditionalInformation"
const mockCreator = {
  avatarUrl: "/example/avatar.jpeg",
  name: "Example Name",
  moto: "Example",
  username: "example",
  bio: "Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞",
  posts: 256,
  likes: 1200,
  description:
    "Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞",
  links: {
    youtube: "blank",
    twitch: "blank",
    instagram: "blank",
    tiktok: "blank"
  },
  popularPictures: [
    "/name/1.png",
    "/name/2.png",
    "/name/3.png",
    "/name/4.png",
    "/name/5.png",
    "/name/6.png",
    "/name/7.png",
    "/name/8.png",
    "/name/9.png",
    "/name/10.png",
    "/name/11.png",
    "/name/12.png"
  ],
  nftPasses: [
    {
      name: "Example #8",
      logoUrl: "/pages/profile/passExamples/passExample.png"
    },
    {
      name: "Example #9",
      logoUrl: "/pages/profile/passExamples/passExample.png"
    },
    {
      name: "Example #11",
      logoUrl: "/pages/profile/passExamples/passExample.png"
    }
  ]
}

type Tabs = "about" | "posts" | "passes"

function isCurrentlyActive(tabName: Tabs, activeTab: Tabs) {
  if (tabName === activeTab) {
    return "tab-active font-extrabold"
  }
}
// TODO: Tabs could be replaced with simple join classNames on active or inactive instead of Underlinetab and isCurrentlyActive functions

const UnderlineTab = (props: { currentTab: Tabs; activeTab: Tabs }) => {
  const { currentTab, activeTab } = props
  if (currentTab !== activeTab) return null

  return (
    <div
      style={{
        width: "50px",
        height: "6px",
        background: "rgba(142, 78, 198, 0.5)",
        borderRadius: "9999px"
      }}
    ></div>
  )
}

const Username = () => {
  const [activeTab, setActiveTab] = useState<Tabs>("about")
  const [follow, setFollow] = useState(false)

  return (
    <div className="flex h-full w-full flex-row">
      <NavigationMenu />
      <div className="w-full">
        <div className="flex w-full justify-center bg-[url(/pages/profile/profile-background-full.png)] bg-cover sm:py-20 md:h-[531px]">
          <div className="absolute top-6 right-8">
            <span className="text-xl">
              <span className="font-semibold">{mockCreator.posts}</span> Posts
            </span>
            <span className="text-xl"> | </span>
            <span className="text-xl">
              <span className="font-semibold">
                {nFormatter(mockCreator.likes)}
              </span>{" "}
              Likes
            </span>
          </div>
          <div className="z-10 hidden md:absolute md:block">
            <CenteredGradient className="absolute right-[178px] top-[159px] hidden md:block" />
            <CenteredLeftGradient className=" absolute right-[577px] top-[110px] hidden md:block" />
          </div>
          <GrainyVector className="absolute top-0 right-0 hidden h-[531px] w-full opacity-75 md:block" />
          <div className="z-20 my-24 flex w-full max-w-7xl flex-col place-items-center justify-center sm:my-0 sm:ml-32 sm:flex-row sm:px-20 md:ml-32 lg:ml-72">
            <ProfileAvatar />
            <ProfileAvatarAdditionalInformation
              mockCreator={mockCreator}
              follow={follow}
              setFollow={setFollow}
            />
          </div>
        </div>
        <div className="tabs flex w-full justify-center" id="profileTabs">
          <div
            className=" flex max-w-7xl flex-1 cursor-pointer sm:ml-20 md:ml-32 lg:ml-60"
            style={{ zIndex: 1 }}
          >
            <a
              className={`tab flex h-16 flex-1 flex-col text-lg text-white
            ${isCurrentlyActive("about", activeTab)}`}
              onClick={() => setActiveTab("about")}
            >
              <div>About</div>
              <UnderlineTab currentTab="about" activeTab={activeTab} />
            </a>
            <a
              className={`tab flex h-16 flex-1 flex-col text-lg text-white
            ${isCurrentlyActive("posts", activeTab)}`}
              onClick={() => setActiveTab("posts")}
            >
              <div>Posts</div>
              <UnderlineTab currentTab="posts" activeTab={activeTab} />
            </a>
            <a
              className={`tab flex h-16 flex-1 flex-col text-lg text-white
            ${isCurrentlyActive("passes", activeTab)}`}
              onClick={() => setActiveTab("passes")}
            >
              <div>Passes</div>
              <UnderlineTab currentTab="passes" activeTab={activeTab} />
            </a>
          </div>
        </div>
        <div
          className="flex justify-center pt-10 text-white"
          style={{
            background: "#1F1422"
          }}
        >
          <div className="max-w-7xl md:ml-32 lg:ml-60">
            <div
              className="flex"
              style={{
                borderTop: "none"
              }}
            >
              {activeTab === "about" && (
                <AboutCreator mockCreator={mockCreator} />
              )}
              {activeTab === "posts" && <CreatorPosts creator={mockCreator} />}
            </div>
          </div>
        </div>
      </div>
    </div>
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

function nFormatter(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  }
  return num
}
