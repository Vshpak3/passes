import Text from "src/components/text"
import Social from "src/icons/social"
import { useState } from "react"
import RedTopVector from "/public/pages/profile/profile-bg-red-top.svg"
import PurpleRightVector from "/public/pages/profile/profile-bg-purple-right.svg"
import BlueLeftVector from "/public/pages/profile/profile-bg-blue-left.svg"
import GrainyVector from "/public/pages/profile/grainy.svg"
import NavigationMenu from "src/components/navigation-menu/navigation-menu"
import AboutCreator from "src/components/pages/profile/about-creator"
import CreatorPosts from "src/components/pages/profile/posts/creator-posts"

const mockCreator = {
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
          className="flex justify-center sm:py-20 md:h-96"
          style={{ background: "rgba(43, 14, 68, 1)" }}
        >
          <div
            className="hidden md:block"
            style={{
              top: "-150px",
              position: "absolute",
              zIndex: 1
            }}
          >
            <RedTopVector />
            <RedTopVector
              style={{ top: "-30px", position: "absolute", zIndex: 1 }}
            />
          </div>
          <div
            className="top-96 left-0 sm:top-12 md:left-12 md:top-20"
            style={{
              position: "absolute",
              zIndex: 0
            }}
          >
            <BlueLeftVector />
            <div className="hidden sm:block">
              <BlueLeftVector
                style={{
                  top: "20%",
                  position: "absolute",
                  zIndex: 0
                }}
              />
            </div>
          </div>
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
            className="my-24 flex w-full max-w-7xl flex-col flex-col-reverse place-items-center justify-center sm:my-0 sm:ml-32 sm:flex-row sm:px-20 md:ml-32 lg:ml-72"
            style={{ zIndex: 2 }}
          >
            <div className=" flex-1 ">
              <h1 className="text-4xl font-semibold uppercase text-white lg:text-6xl">
                <span>{mockCreator.name}</span>
              </h1>
              <h2
                style={{ lineHeight: 1 }}
                className="mt-6 justify-start justify-center gap-2 text-lg text-slate-300 xl:text-2xl"
              >
                Save America. Win big prices
              </h2>
              <div>
                <button className="mt-7 mr-4 h-20 w-72 rounded-2xl bg-white text-xl font-bold">
                  Join Whitelist
                </button>
                <button
                  className="text-md ml-5 hidden h-11 text-xl text-white xl:inline"
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
              className="lg:mb-none relative mb-4 mt-7 w-fit scale-75 items-start  px-4 lg:mb-8 lg:scale-100	"
              style={{ transform: "rotate(353deg)" }}
            >
              <div
                style={{
                  boxShadow:
                    " inset 0px 10.5007px 14.0009px #FFFFFF, inset -2.33348px 3.50022px 4.66696px #FFFFFF, inset -5.8337px -5.8337px 5.8337px rgba(86, 23, 80, 0.5), inset 0px -18.42px 29.472px rgba(43, 14, 68, 0.5)",
                  backgroundImage: "url('/andrea-botez/avatar.jpeg')",
                  backgroundSize: "cover"
                }}
                className="w mb-2 h-40 w-40 rounded-full xl:h-60 xl:w-60"
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
              {activeTab === "about" && <AboutCreator />}
              {activeTab === "posts" && <CreatorPosts creator={mockCreator} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Username
