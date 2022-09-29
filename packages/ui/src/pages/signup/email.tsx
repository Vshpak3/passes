import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput, Text, Wordmark } from "src/components/atoms"

import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "../../helpers/authRouter"
import { isDev } from "../../helpers/env"
import { setTokens } from "../../helpers/setTokens"
import { useUser } from "../../hooks"

const UserEmailPage = () => {
  const router = useRouter()
  const { userClaims, setAccessToken, setRefreshToken } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [hasSentEmail, setHasSentEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    setHasSentEmail(router.query.hasEmail == "true")

    authRouter(router, userClaims)
  }, [router, userClaims])

  const onUserRegister = async (email: string) => {
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const api = new AuthApi()
      await api.setUserEmail({ setEmailRequestDto: { email } })

      // In local development (dev) we auto-verify the email
      if (isDev) {
        const res = await api.verifyUserEmail({
          verifyEmailDto: {
            verificationToken: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
          }
        })

        const setRes = setTokens(res, setAccessToken, setRefreshToken)
        if (!setRes) {
          alert("ERROR: Received no access token")
        }

        router.push(authStateToRoute(AuthStates.VERIFY))
      }

      setHasSentEmail(true)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: Record<string, string>) => {
    onUserRegister(data.email)
  }

  return (
    // Do not use AuthOnlyWrapper, login/signup flow uses custom routing
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
          {hasSentEmail ? (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Email sent!
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                We have sent an email to you to verify your email address.{" "}
                <br />
                Please click in the link your email to continue.
              </Text>
            </>
          ) : (
            <>
              <Text
                fontSize={36}
                className="mb-4 w-[360px] text-center font-semibold text-white"
              >
                Let&apos;s get to know each other
              </Text>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-5"
              >
                <div className="flex flex-col">
                  <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                    Email address
                  </Text>
                  <FormInput
                    register={register}
                    name="email"
                    className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                    placeholder="Enter your email address"
                    type="text"
                    errors={errors}
                    options={{
                      required: true
                    }}
                  />
                  {errors.emailAddress && (
                    <Text fontSize={12} className="mt-1 text-[red]">
                      {errors.emailAddress.message?.toString()}
                    </Text>
                  )}
                </div>

                <button
                  className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Text fontSize={16} className="font-medium">
                    Register account
                  </Text>
                  <EnterIcon />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserEmailPage
