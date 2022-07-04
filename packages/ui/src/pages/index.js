import Image from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import Marquee from "react-fast-marquee"
import Button from "src/components/button"
import Link from "src/components/link"
import Separator from "src/components/separator"
import Sparkles from "src/components/sparkles"
import Text from "src/components/text"
import usePrefersReducedMotion from "src/hooks/use-prefers-reduced-motion"

const backersList = [
  {
    image: "/images/backers/kyle.png",
    name: "Kyle Samani",
    org: "Multicoin Capital"
  },
  {
    image: "/images/backers/david.png",
    name: "David Sacks",
    org: "Craft Ventures"
  },
  {
    image: "/images/backers/wenwen.png",
    name: "Wen-Wen Lam",
    org: "Gradient Ventures"
  },
  { image: "/images/backers/jake.png", name: "Jake Paul", org: "Antifund" }
]

const creatorsList = [
  { type: "Communities" },
  { type: "Podcasters" },
  { type: "Musicians" },
  { type: "Visual Artists" },
  { type: "YouTubers" },
  { type: "TikTokers" },
  { type: "Streamers" },
  { type: "Writers & Journalists" },
  { type: "Educators" }
]

const HomePage = () => {
  const router = useRouter()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { data: session } = useSession()

  useEffect(() => {
    router.prefetch("/login")
    router.prefetch("/signup")
  }, [router])

  return (
    <div className="relative h-full w-full bg-mauveDark-mauve1">
      <div className="relative w-full bg-[#1A1523]">
        <div className="fade-in-bottom container pt-10">
          <header className="relative">
            <div className="absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-[#620A3F] to-[#5A44CA] opacity-30 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center justify-between gap-8 rounded-xl py-8 shadow-[0px_0px_120px_0px_rgba(0,_0,_0,_0.25)_inset] backdrop-blur sm:flex-row sm:shadow-none sm:backdrop-blur-none">
              <Image
                className="opacity-90 backdrop-blur"
                src="/moment.svg"
                aria-label="moment"
                height={42}
                width={42}
                alt=""
              />
              <div className="flex flex-wrap items-center justify-center gap-8">
                {session ? (
                  <NextLink href="/subscriptions">
                    <Button
                      className="font-medium"
                      variant="white"
                      bigger
                      fontSize={15}
                    >
                      Go to Profile
                    </Button>
                  </NextLink>
                ) : session === null ? (
                  <>
                    <Link href="/login">Login</Link>
                    <NextLink href="/signup">
                      <Button
                        className="font-medium"
                        variant="white"
                        bigger
                        fontSize={15}
                      >
                        Get Started
                      </Button>
                    </NextLink>
                  </>
                ) : (
                  <Button
                    className="font-medium opacity-10"
                    variant="white"
                    bigger
                    fontSize={15}
                  >
                    <span className="invisible">Go to Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </header>
        </div>
        <div
          style={{ "--stagger": 1 }}
          className="fade-in-bottom container relative w-full pt-12"
        >
          <div
            style={{ animationDelay: "250ms" }}
            className="absolute -bottom-24 left-0 hidden h-36 w-36 rounded-full bg-redDark-red9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <div
            style={{ animationDelay: "1000ms" }}
            className="absolute bottom-24 -left-24 hidden h-36 w-36 rounded-full bg-pinkDark-pink9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <div
            style={{ animationDelay: "500ms" }}
            className="absolute -bottom-24 -left-48 hidden h-36 w-36 rounded-full bg-purpleDark-purple9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <div
            style={{ animationDelay: "750ms" }}
            className="absolute top-0 -right-24 hidden h-36 w-36 rounded-full bg-crimsonDark-crimson9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <div
            style={{ animationDelay: "800ms" }}
            className="absolute bottom-0 -right-8 hidden h-36 w-36 rounded-full bg-plumDark-plum9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <div
            style={{ animationDelay: "400ms" }}
            className="absolute bottom-0 -right-60 hidden h-36 w-36 rounded-full bg-violetDark-violet9 opacity-30 blur-3xl motion-safe:animate-pulse sm:block"
          />
          <Text
            style={{ lineHeight: "1.1em" }}
            className="mx-auto max-w-2xl bg-transparent text-center font-semibold uppercase text-mauveDark-mauve12"
            tag="h1"
            fontSize={60}
          >
            A{" "}
            <Sparkles>
              <span>
                <span className="text-redDark-red9">M</span>
                <span className="text-crimsonDark-crimson9">O</span>
                <span className="text-pinkDark-pink9">M</span>
                <span className="text-plumDark-plum9">E</span>
                <span className="text-purpleDark-purple9">N</span>
                <span className="text-violetDark-violet9">T</span>
              </span>
            </Sparkles>{" "}
            For Creators and You.
          </Text>
          <Text
            className="mx-auto mt-4 max-w-md text-center text-mauveDark-mauve11"
            tag="p"
            fontSize={20}
          >
            <em>web3</em> platform for creators
            <br />
            to scale their content <span>{"&"}</span> own their audiences.
          </Text>
          <div className="flex justify-center">
            <Button variant="purple" bigger href="https://jobs.lever.co/Moment">
              See Open Positions
            </Button>
          </div>
        </div>
        <div className="relative">
          <svg
            fill="none"
            height="100%"
            width="100%"
            viewBox="0 0 1507 223"
            xmlns="http://www.w3.org/2000/svg"
          >
            <linearGradient
              id="a"
              gradientUnits="userSpaceOnUse"
              x1={828.5}
              x2={837.5}
              y1={71}
              y2={223}
            >
              <stop offset={0} stopColor="#1a1523" />
              <stop offset={0.947497} stopColor="#161618" />
            </linearGradient>
            <path d="M1507 222.5H0L1507 0z" fill="url(#a)" />
            <path d="M1507 222.5H0L1507 0z" fill="url(#a)" />
          </svg>
        </div>
      </div>
      <div className="relative w-full bg-mauveDark-mauve1">
        <div className="absolute top-0 h-40 w-full bg-mauveDark-mauve1" />
        <main
          style={{ "--stagger": 2 }}
          className="fade-in-bottom container relative"
        >
          <div className="flex -translate-y-0 flex-col items-center pt-10 lg:-translate-y-6 lg:pt-0">
            <Text
              className="mx-auto mb-10 text-center font-semibold"
              fontSize={28}
            >
              Backed by World-Class Builders
            </Text>
            <div className="flex w-full flex-wrap justify-center gap-2">
              {backersList.map((backer, index) => (
                <div
                  className="group w-full max-w-[150px] bg-mauveDark-mauve1 transition sm:max-w-[200px]"
                  key={index}
                >
                  <div className="flex flex-col items-center py-6 px-2 text-center">
                    <div className="h-[60px] w-[60px] rounded-full bg-mauveDark-mauve3 group-hover:bg-purpleDark-purple2 group-hover:outline group-hover:outline-purpleDark-purple1">
                      <Image
                        className="rounded-full mix-blend-luminosity"
                        src={backer.image}
                        width={60}
                        height={60}
                        layout="fixed"
                        objectFit="cover"
                        alt=""
                      />
                    </div>
                    <Text className="mt-3 font-medium" fontSize={18}>
                      {backer.name}
                    </Text>
                    <Text className="text-mauveDark-mauve11">{backer.org}</Text>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="mt-16 mb-8" />
            <Text
              className="mx-auto mb-10 text-center font-semibold"
              fontSize={28}
            >
              Supporting Creators
            </Text>
            <div className="relative hidden w-screen lg:block">
              <Marquee
                pauseOnHover
                gradientColor={[22, 22, 24]}
                gradient
                play={prefersReducedMotion ? false : true}
              >
                {creatorsList.map((creator, index) => (
                  <div
                    className="mx-2 min-w-fit rounded-full border border-purpleDark-purple6 px-12 py-3 text-purpleDark-purple11"
                    key={index}
                  >
                    {creator.type}
                  </div>
                ))}
              </Marquee>
            </div>
            <div className="relative block w-screen lg:hidden">
              <Marquee
                pauseOnHover
                gradientColor={[22, 22, 24]}
                gradient
                gradientWidth={32}
                play={prefersReducedMotion ? false : true}
              >
                {creatorsList.map(
                  (
                    creator,
                    index // eslint-disable-line sonarjs/no-identical-functions
                  ) => (
                    <div
                      className="mx-2 min-w-fit rounded-full border border-purpleDark-purple6 px-12 py-3 text-purpleDark-purple11"
                      key={index}
                    >
                      {creator.type}
                    </div>
                  )
                )}
              </Marquee>
            </div>
            <Separator className="mt-16" />
          </div>
        </main>
        <footer
          style={{ "--stagger": 3 }}
          className="fade-in-bottom container flex flex-col gap-8 pb-16 pt-8 text-center sm:flex-row sm:justify-between sm:gap-2 sm:text-left lg:pt-0"
        >
          <div>
            <div className="text-mauveDark-mauve12">
              Building in 🗽 NYC{" "}
              <span className="mx-1 text-mauveDark-mauve11">+</span> 🌴 Miami.
            </div>
            <div className="mt-2 text-mauveDark-mauve11">
              © Moment HQ Inc. All Rights Reserved.
            </div>
          </div>
          <ul>
            <li>
              <Button href="mailto:team@moment.vip" variant="purple">
                Email Us
              </Button>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  )
}

HomePage.theme = "dark"
export default HomePage
