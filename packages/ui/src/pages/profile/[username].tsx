import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import Button from "src/components/button"
import Text from "src/components/text"
import Social from "src/icons/social"

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

const Username = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { username } = router.query

  return (
    <div className="relative h-full w-full">
      <div>
        <div className="flex w-full flex-col items-center gap-2 pt-12 lg:flex-row lg:gap-12">
          <div
            className="ml-2 flex w-full"
            style={{
              border: "1px solid red",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <div>
              <Text
                style={{ lineHeight: 1 }}
                className="flex items-center justify-center gap-2 font-semibold lg:justify-start"
                tag="h1"
                fontSize={32}
              >
                <span>{mockData.name}</span>
              </Text>
              <Text
                style={{ lineHeight: 1 }}
                className="flex items-center justify-center gap-2 lg:justify-start"
                tag="h1"
                fontSize={20}
              >
                <span>Save America. Win big prices</span>
              </Text>
              <div>
                <Button
                  style={{
                    border: "1px solid black",
                    height: "5rem",
                    borderRadius: "1rem"
                  }}
                >
                  Join Whitelist
                </Button>
                <Button
                  style={{
                    height: "5rem"
                  }}
                >
                  Learn more
                </Button>
              </div>
            </div>
            <div className="lg:mb-none relative mb-4 w-fit scale-75 px-4 lg:mb-8 lg:scale-100">
              <img src={mockData.avatarUrl} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  height: "3rem"
                }}
              >
                <Social variant="Instagram" />
                <Social variant="YouTube" />
                <Social variant="Twitch" />
                <Social variant="Discord" />
                <Social variant="Tiktok" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid grey",
          margin: "0.7rem",
          padding: "0.7rem"
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: "bolder"
            }}
          >
            Who is Andrea Botez
          </h2>
          <Text className="text-mauve-mauve12 dark:text-mauveDark-mauve12">
            {mockData.bio}
          </Text>
        </div>
        <div>
          <h2
            style={{
              fontWeight: "bolder"
            }}
          >
            Overview of Passes
          </h2>
          <Text className="text-mauve-mauve12 dark:text-mauveDark-mauve12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default Username
