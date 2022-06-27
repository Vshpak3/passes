import Text from "src/components/text"
import Social from "src/icons/social"
import { useState } from "react"
import RedTopVector from "/public/pages/profile/profile-bg-red-top.svg"
import PurpleRightVector from "/public/pages/profile/profile-bg-purple-right.svg"
import BlueLeftVector from "/public/pages/profile/profile-bg-blue-left.svg"
import GrainyVector from "/public/pages/profile/grainy.svg"
import NavigationMenu from "src/components/navigation-menu/navigation-menu"

const mockData = {
  avatarUrl: "/andrea-botez/avatar.jpeg",
  name: "Andrea Botez",
  username: "andreabotez",
  bio: "Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞",
  links: {
    youtube: "Botezlive",
    twitch: "botezlive",
    instagram: "itsandreabotez",
    tiktok: "andreabotez"
  },
  popularPictures: [
    "/andrea-botez/1.png",
    "/andrea-botez/2.png",
    "/andrea-botez/3.png",
    "/andrea-botez/4.png",
    "/andrea-botez/5.png",
    "/andrea-botez/6.png",
    "/andrea-botez/7.png",
    "/andrea-botez/8.png",
    "/andrea-botez/9.png",
    "/andrea-botez/10.png",
    "/andrea-botez/11.png",
    "/andrea-botez/12.png"
  ]
}

const iconsDimensions = 17

type Tabs = "about" | "posts" | "passes"

function isCurrentlyActive(tabName: Tabs, activeTab: Tabs) {
  if (tabName === activeTab) {
    return "tab-active font-extrabold"
  }
}

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

  return (
    <div className="flex h-full w-full flex-row">
      <NavigationMenu />
      <div className="w-full">
        <div
          className="flex h-96 justify-center py-20"
          style={{ background: "rgba(43, 14, 68, 1)" }}
        >
          <RedTopVector
            style={{
              top: "-150px",
              position: "absolute",
              zIndex: 1
            }}
          />
          <RedTopVector
            style={{ top: "-100px", position: "absolute", zIndex: 1 }}
          />
          <BlueLeftVector
            style={{
              left: "7%",
              top: "108px",
              position: "absolute",
              zIndex: 0
            }}
          />
          <BlueLeftVector
            style={{
              left: "10%",
              top: "108px",
              position: "absolute",
              zIndex: 0
            }}
          />
          <PurpleRightVector
            style={{ right: "0", top: "56px", position: "absolute", zIndex: 0 }}
          />
          <PurpleRightVector
            style={{
              right: "-50px",
              top: "56px",
              position: "absolute",
              zIndex: 0
            }}
          />
          <GrainyVector
            style={{
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              position: "absolute",
              height: "384px",
              opacity: 0.7
            }}
          />
          <div
            className="ml-60 flex w-full max-w-7xl place-items-center justify-center px-20"
            style={{ zIndex: 2 }}
          >
            <div className=" flex-1 ">
              <Text
                className="flex items-center justify-center font-semibold uppercase text-white lg:justify-start"
                tag="h1"
                fontSize={64}
              >
                <span>{mockData.name}</span>
              </Text>
              <Text
                style={{ lineHeight: 1 }}
                className="mt-3 flex items-center justify-center gap-2 text-slate-300 lg:justify-start"
                tag="h1"
                fontSize={26}
              >
                Save America. Win big prices
              </Text>
              <div>
                <button className="mt-7 mr-4 h-20 w-72 rounded-2xl bg-white text-xl font-bold">
                  Join Whitelist
                </button>
                <button
                  className="text-md ml-5 h-11 text-xl text-white"
                  style={{
                    padding: "0 0 10px 0",
                    borderBottom: "1px solid white",
                    lineHeight: "60px"
                  }}
                >
                  Learn more
                </button>
              </div>
            </div>
            <div
              className="lg:mb-none relative mb-4 mt-7 w-fit scale-75 px-4 lg:mb-8 lg:scale-100	"
              style={{ transform: "rotate(353deg)" }}
            >
              <div
                style={{
                  borderRadius: "3.5rem",
                  boxShadow:
                    "inset 0px 10.5007px 14.0009px #FFFFFF, inset -2.33348px 3.50022px 4.66696px #FFFFFF, inset -5.8337px -5.8337px 5.8337px #561750, inset 0px -18.42px 29.472px #2B0E44",
                  WebkitBoxShadow: "none",
                  backgroundImage: "url('/andrea-botez/avatar.jpeg')",
                  backgroundSize: "cover"
                }}
                className="w mb-2 h-60 w-60"
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  height: "3rem"
                }}
              >
                <div
                  className="rounded-full p-2"
                  style={{
                    background: "#00000039"
                  }}
                >
                  <Social
                    variant="Instagram"
                    width={iconsDimensions}
                    height={iconsDimensions}
                  />
                </div>
                <div
                  className="rounded-full p-2"
                  style={{
                    background: "#00000039"
                  }}
                >
                  <Social
                    variant="YouTube"
                    width={iconsDimensions}
                    height={iconsDimensions}
                  />
                </div>
                <div
                  className="rounded-full p-2"
                  style={{
                    background: "#00000039"
                  }}
                >
                  <Social
                    variant="Discord"
                    width={iconsDimensions}
                    height={iconsDimensions}
                  />
                </div>
                <div
                  className="rounded-full p-2"
                  style={{
                    background: "#00000039"
                  }}
                >
                  <Social
                    variant="Tiktok"
                    width={iconsDimensions}
                    height={iconsDimensions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tabs flex w-full justify-center" id="profileTabs">
          <div
            className="ml-60 flex max-w-7xl flex-1 cursor-pointer"
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
          <div className="ml-60 max-w-7xl">
            <div
              className="flex"
              style={{
                borderTop: "none"
              }}
            >
              <div
                className=" p-10 px-20"
                style={{
                  borderRight: "1px solid #3b3b3b"
                }}
              >
                <h2
                  className="mb-4 text-white"
                  style={{
                    fontWeight: "bolder"
                  }}
                >
                  Who is Andrea Botez
                </h2>
                <Text className="text-gray-400  dark:text-mauveDark-mauve12">
                  {mockData.bio}
                </Text>
                <h2
                  className="mt-10 mb-4"
                  style={{
                    fontWeight: "bolder"
                  }}
                >
                  Overview of Passes
                </h2>
                <Text className="text-gray-400 ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                  ea commodo consequat. Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                  ea commodo consequat. Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </Text>
              </div>
              <div className="py-15 p-20" style={{ borderTop: "none" }}>
                <div
                  className="mb-20 h-60 max-h-60 w-60 bg-gray-500"
                  style={{ transform: "rotate(-18deg)" }}
                >
                  NFT
                </div>
                <div
                  className="mb-20 h-60 max-h-60 w-60 bg-gray-500"
                  style={{ transform: "rotate(18deg)" }}
                >
                  NFT
                </div>
                <div
                  className="mb-10 h-60 max-h-60 w-60 bg-gray-500"
                  style={{ transform: "rotate(-18deg)" }}
                >
                  NFT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Username
