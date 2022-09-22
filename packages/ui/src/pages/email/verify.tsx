import { AuthApi } from "@passes/api-client/apis"
import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Text, Wordmark } from "src/components/atoms"
import { wrapApi } from "src/helpers/wrapApi"

import {
  authRouter,
  authStateMachine,
  AuthStates
} from "../../helpers/authRouter"
import { setTokens } from "../../helpers/setTokens"
import { useUser } from "../../hooks"
import { JWTUserClaims } from "../../hooks/useUser"

const VerifyEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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

        const api = wrapApi(AuthApi)
        const res = await api.verifyUserEmail({
          verifyEmailDto: { verificationToken }
        })

        const setRes = setTokens(res, setAccessToken, setRefreshToken)
        if (!setRes) {
          alert("ERROR: Received no access token")
        }

        authRouter(router, jwtDecode<JWTUserClaims>(res.accessToken))
      } catch (err: any) {
        console.error(err)
        setError(
          "Is the email verification link valid? Or perhaps it has expired?"
        )
      } finally {
        setIsLoading(false)
      }
    }

    verify()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <div className=" flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/userInfoBackground.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          {isLoading ? (
            <>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Loading...
              </Text>
            </>
          ) : error ? (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Failed to verify email!
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">{error}</Text>
            </>
          ) : (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Email verified!
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Thank you for verifying your email!
              </Text>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
