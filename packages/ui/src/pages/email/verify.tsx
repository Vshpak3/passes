import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
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
import { WithStandAlonePageLayout } from "src/layout/WithStandAlonePageLayout"

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
          await sleep("4 seconds")
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
    <div className="z-10 flex w-screen max-w-[750px] flex-col items-center justify-center px-8">
      {isLoading ? (
        <>
          <Text
            className="mb-4 text-center font-[500] text-white"
            fontSize={36}
          >
            Verifying...
          </Text>
          <Text className="mb-4 text-passes-gray-100">
            Please wait, while we verify your email address.
          </Text>
        </>
      ) : error ? (
        <>
          <Text
            className="mb-4 text-center font-[500] text-white"
            fontSize={36}
          >
            Verification Failed.
          </Text>
          <Text className="mb-4 text-passes-gray-100">{error}</Text>
        </>
      ) : (
        <>
          <Text
            className="mb-4 w-[420px] text-center font-[500] text-white"
            fontSize={36}
          >
            Thank you for verifying!
          </Text>
          <Text className="mb-4 text-center text-passes-gray-100">
            Your email address has been successfully verified. You may now
            proceed to the website.
          </Text>
          <Button
            className="h-[44px] w-[360px]"
            onClick={() => authRouter(safePush, userClaims)}
            type={ButtonTypeEnum.SUBMIT}
          >
            Continue
          </Button>
        </>
      )}
    </div>
  )
}

export default WithStandAlonePageLayout(VerifyEmailPage, {
  className: "h-screen my-[20vh]"
})
