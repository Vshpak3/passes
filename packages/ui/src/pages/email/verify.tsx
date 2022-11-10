import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import PassesLogoFull from "public/icons/passes-logo-full.svg"
import { useEffect, useState } from "react"

import { Text } from "src/components/atoms/Text"
import {
  authRouter,
  authStateMachine,
  AuthStates
} from "src/helpers/authRouter"
import { queryParam } from "src/helpers/query"
import { sleep } from "src/helpers/sleep"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const router = useRouter()
  const { safePush } = useSafeRouter()
  const { userClaims } = useUser()
  const { auth } = useAuthEvent()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (userClaims && authStateMachine(userClaims) !== AuthStates.EMAIL) {
      authRouter(safePush, userClaims)
    }

    verifyEmail()

    // We cannot add userClaims here since then this would trigger during the
    // update and we won't have time to show the confirmation screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const verifyEmail = async () => {
    try {
      const id = queryParam(router.query.id)

      // Needs to match /email/verify?id=${id}
      if (!id) {
        authRouter(safePush, userClaims)
        return
      }

      await auth(
        async () => {
          const api = new AuthApi()
          return await api.verifyUserEmail({
            verifyEmailDto: { verificationToken: id }
          })
        },
        async (token) => {
          // Route manually so we can show the confirmation screen before routing
          await sleep("3 seconds")
          authRouter(safePush, token)
        },
        false
      )
    } catch (error: unknown) {
      console.error(error)
      setError(
        "Error occurred verifying your email address. The link is wrong or has been expired."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <div className="z-10 my-auto flex justify-center">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black opacity-[60] md:border md:py-8 md:px-24 lg:py-16 lg:px-48">
          <div className="p-4">
            <PassesLogoFull />
          </div>
          {isLoading ? (
            <>
              <Text
                className="mb-4 w-[360px] text-center font-[500] text-white"
                fontSize={36}
              >
                Verifying...
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Please wait, while we verify your email address.
              </Text>
            </>
          ) : error ? (
            <>
              <Text
                className="mb-4 w-[360px] text-center font-[500] text-white"
                fontSize={36}
              >
                Verification Failed.
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                {error}
              </Text>
            </>
          ) : (
            <>
              <Text
                className="mb-4 w-[420px] text-center font-[500] text-white"
                fontSize={36}
              >
                Thank you for verifying!
              </Text>
              <Text className="mb-1 w-[420px] text-center text-[#b3bee7] opacity-[0.75]">
                Your email address has been successfully verified. You may now
                proceed to the website.
              </Text>
              <button
                className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
                onClick={() => authRouter(safePush, userClaims)}
                type="submit"
              >
                <Text className="font-medium" fontSize={16}>
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

export default VerifyEmailPage // no WithNormalPageLayout
