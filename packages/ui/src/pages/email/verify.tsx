import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import PassesLongLogo from "public/icons/passes-long-logo.svg"
import { useEffect, useState } from "react"
import { Text, Wordmark } from "src/components/atoms"
import {
  authRouter,
  authStateMachine,
  AuthStates
} from "src/helpers/authRouter"
import { setTokens } from "src/helpers/setTokens"
import { useUser } from "src/hooks"

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const router = useRouter()
  const { userClaims, setAccessToken, setRefreshToken } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (userClaims && authStateMachine(userClaims) !== AuthStates.EMAIL) {
      authRouter(router, userClaims)
    }

    const verify = async () => {
      try {
        const id = router.query.id

        // Needs to match /email/verify?id=${id}
        if (!id) {
          authRouter(router, userClaims)
          return
        }

        const verificationToken = Array.isArray(id) ? id[0] : (id as string)

        const api = new AuthApi()
        const res = await api.verifyUserEmail({
          verifyEmailDto: { verificationToken }
        })
        const setRes = setTokens(res, setAccessToken, setRefreshToken)
        if (!setRes) {
          return
        }
      } catch (err: any) {
        console.error(err)
        setError(
          "Error occurred verifying your email address. The link is wrong or has been expired."
        )
      } finally {
        setIsLoading(false)
      }
    }

    verify()

    // We cannot add userClaims here since then this would trigger during the
    // update and we won't have time to show the confirmation screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setAccessToken, setRefreshToken, userClaims])

  return (
    <div className=" flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="z-10 my-auto flex justify-center">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black opacity-[60] md:border md:py-8 md:px-24  lg:py-16 lg:px-48">
          <div className="p-4">
            <PassesLongLogo />
          </div>
          {isLoading ? (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Verifying...
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Please wait, while we verify your email address.
              </Text>
            </>
          ) : error ? (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Verification Failed.
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">{error}</Text>
            </>
          ) : (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[420px] text-center font-semibold text-white"
              >
                Thank you for verifying!
              </Text>
              <Text className="mb-1 w-[420px] text-center text-[#b3bee7] opacity-[0.6]">
                Your email address has been successfully verified. You may now
                proceed to the website.
              </Text>
              <button
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                type="submit"
                onClick={() => authRouter(router, userClaims)}
              >
                <Text fontSize={16} className="font-medium">
                  Continue
                </Text>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
