import NextHead from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Button from "src/components/button"
import Separator from "src/components/separator"
import Text from "src/components/text"
import Wordmark from "src/components/wordmark"
import useUser from "src/hooks/useUser"
import Arrow from "src/icons/arrow"
import Social from "src/icons/social"

const LoginPage = () => {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!router.isReady || !user?.id) {
      return
    }

    router.push("/test")
  }, [router, user])

  const handleLoginWithGoogle = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google")
  }

  return (
    <>
      <NextHead // hotfix for web font optimization issue: https://github.com/vercel/next.js/issues/35835#issuecomment-1125599724
      >
        <link // eslint-disable-line @next/next/no-page-custom-font
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

          <Button
            onClick={handleLoginWithGoogle}
            className="w-full max-w-sm bg-[#DB4437] !px-6 !py-5 text-white shadow-md shadow-[#DB4437]/30 transition-all hover:bg-[#DB4437]/90 hover:shadow-sm"
            innerClassName="w-full justify-between font-medium"
            fontSize={16}
          >
            <Social variant="Google" width={16} height={16} />{" "}
            <span>Login with Google</span>
            <span />
          </Button>
        </div>
      </div>
    </>
  )
}

export default LoginPage
