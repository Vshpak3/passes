import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"
import { Button, Separator, Text } from "src/components/atoms"
import { Sparkles } from "src/components/molecules"
import { usePrefersReducedMotion } from "src/hooks"
// import useUser from "src/hooks/useUser"

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
  { image: "/images/backers/jake.png", name: "Jake Paul", org: "Antifund" },
  { image: "/images/backers/ryan.jpeg", name: "Ryan Wilson", org: "ThankYouX" }
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
  // const { user } = useUser()

  const [emailAddress, setEmailAddress] = useState("")
  const [isSubmittingEmail, setIsSubmittingEmail] = useState("")
  const [emailFeedback, setEmailFeedback] = useState("")

  const handleSubmitEmail = async () => {
    if (isSubmittingEmail) {
      return
    }

    if (!emailAddress) {
      setEmailFeedback("Please provide an email address!")
      return
    }

    setIsSubmittingEmail(true)

    try {
      await axios.post("/api/email", { emailAddress })
      setEmailFeedback("Thank you for subscribing!")
    } catch (err) {
      setEmailFeedback("An error occurred...")
    } finally {
      setIsSubmittingEmail(false)
    }
  }

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
              {/* <div className="flex flex-wrap items-center justify-center gap-8">
                {user ? (
                  <NextLink href="/profile/toshi">
                    <Button
                      className="font-medium"
                      variant="white"
                      bigger
                      fontSize={15}
                    >
                      Go to Profile
                    </Button>
                  </NextLink>
                ) : (
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
                )}
              </div> */}
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

          <hr
            className="dotted"
            style={{
              "margin-top": "30px",
              "border-top": "3px dotted #bbbbbb2b",
              transparency: "50%"
            }}
          ></hr>

          <div className="mx-auto max-w-2xl p-8 text-white">
            <h3 className="mb-6 text-center text-xl font-semibold">
              Sign Up for Updates
            </h3>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="grow">
                <label
                  htmlFor="email"
                  className="block pl-5 text-sm font-medium text-zinc-400"
                >
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="yourname@example.com"
                    className="block h-12 w-full rounded-full bg-zinc-800 px-5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(v) => setEmailAddress(v.target.value)}
                    value={emailAddress}
                  />
                </div>
              </div>
              <button
                className="block h-12 w-full rounded-full bg-white px-5 text-black sm:px-16 md:w-fit"
                type="submit"
                onClick={handleSubmitEmail}
              >
                {isSubmittingEmail ? (
                  <svg
                    role="status"
                    className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
            {emailFeedback && (
              <p className="pt-6 text-center font-semibold">{emailFeedback}</p>
            )}
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
            <div className="flex w-full flex-wrap justify-center gap-2 md:flex-nowrap">
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
