import { getProviders, signIn, useSession } from "next-auth/react"
import NextHead from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Button from "src/components/button"
import Separator from "src/components/separator"
import Text from "src/components/text"
import Wordmark from "src/components/wordmark"
import Arrow from "src/icons/arrow"
import Social from "src/icons/social"

const SignupPage = ({ providers }) => {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push("/subscriptions")
    }
  }, [router, session])

  return (
    <>
      <NextHead // hotfix for web font optimization issue: https://github.com/vercel/next.js/issues/35835#issuecomment-1125599724
      >
        <link // eslint-disable-line
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Playfair+Display:ital,wght@1,400..800&display=swap"
          rel="stylesheet"
        />
      </NextHead>
      <div className="relative h-full w-full">
        <div className="absolute hidden h-full w-full bg-gradient-to-b from-transparent via-transparent to-purple-purple4 dark:to-purpleDark-purple1 sm:block" />
        <div className="fade-in-bottom container flex justify-center pt-10">
          <Wordmark height={28} width={122} />
        </div>
        <div
          style={{ "--stagger": 1 }}
          className="fade-in-bottom container pb-4"
        >
          <Separator className="my-8" />
          <div className="flex flex-col items-center gap-8">
            <Button
              className="w-full max-w-sm cursor-not-allowed border border-mauve-mauve12 !px-6 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:border-mauveDark-mauve11 dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
              fontSize={16}
            >
              Connect Wallet
            </Button>
            <Button
              className="cursor-not-allowed"
              variant="link-blue"
              fontSize={16}
              innerClassName="!space-x-1"
            >
              <span>Continue with Email</span>{" "}
              <Arrow variant="right" width={16} height={16} />
            </Button>
          </div>
        </div>
        <div
          style={{ "--stagger": 2 }}
          className="fade-in-bottom container flex flex-col items-center gap-6 pb-16"
        >
          <div className="relative my-4 flex w-full items-center justify-center">
            <div className="absolute left-0 w-[calc(50%-1.5rem)]">
              <Separator />
            </div>
            <div className="absolute right-0 w-[calc(50%-1.5rem)]">
              <Separator />
            </div>
            <div className="w-fit">
              <Text className="font-medium text-mauve-mauve12 dark:text-mauveDark-mauve12">
                OR
              </Text>
            </div>
          </div>
          {Object.values(providers).map((provider) => (
            <Button
              onClick={() => signIn(provider.id)}
              className={
                (provider.name === "Discord"
                  ? "bg-[#5865F2] shadow-[#5865F2]/30 hover:bg-[#5865F2]/90"
                  : provider.name === "Google"
                  ? "bg-[#DB4437] shadow-[#DB4437]/30 hover:bg-[#DB4437]/90"
                  : provider.name === "Instagram"
                  ? "bg-[#C13584] shadow-[#C13584]/30 hover:bg-[#C13584]/90"
                  : provider.name === "Twitch"
                  ? "bg-[#9146FF] shadow-[#9146FF]/30 hover:bg-[#9146FF]/90"
                  : "") +
                " w-full max-w-sm !px-6 !py-5 text-white shadow-md transition-all hover:shadow-sm"
              }
              innerClassName="w-full justify-between font-medium"
              fontSize={16}
              key={provider.name}
            >
              <Social variant={provider.name} width={16} height={16} />{" "}
              <span>Sign Up with {provider.name}</span>
              <span />
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: { providers }
  }
}

export default SignupPage
