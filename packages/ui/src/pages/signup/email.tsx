import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Wordmark } from "src/components/atoms/Wordmark"
import { isDev } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

export interface SignupEmailPageSchema {
  email: string
}

const signupPageEmailSchema: SchemaOf<SignupEmailPageSchema> = object({
  email: string()
    .required("Enter your email address")
    .email("Email address is invalid")
})

const SignupEmailPage: FC = () => {
  const router = useRouter()
  const { auth } = useAuthEvent()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupEmailPageSchema>({
    resolver: yupResolver(signupPageEmailSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [hasSentEmail, setHasSentEmail] = useState(true)
  const [hasResentEmail, setHasResentEmail] = useState(true)

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    setHasSentEmail(router.query.hasEmail === "true")
  }, [router])

  const verifyEmail = async (email: string) => {
    const api = new AuthApi()
    await api.setUserEmail({ setEmailRequestDto: { email } })

    // In local development we auto-verify the email
    if (isDev) {
      await auth(async () => {
        return await api.verifyUserEmail({
          verifyEmailDto: {
            verificationToken: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
          }
        })
      })
    }

    router.query.hasEmail = "true"
    router.query.email = email
    router.push(router)
  }

  const resendEmail = async () => {
    setHasResentEmail(false)

    const email = router.query.email as string
    const api = new AuthApi()
    await api.setUserEmail({
      setEmailRequestDto: { email }
    })

    setHasResentEmail(true)
  }

  const onSubmit = (data: SignupEmailPageSchema) => {
    try {
      setIsSubmitting(true)
      verifyEmail(data.email)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        className="z-10 self-center lg:self-start"
        height={28}
        whiteOnly
        width={122}
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#12070E] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]" />
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          {hasSentEmail ? (
            <>
              <Text
                className="mb-4 w-[360px] text-center font-semibold text-white"
                fontSize={36}
              >
                Email sent!
              </Text>
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                We have sent an email to you to verify your email address.{" "}
                <br />
                Please click in the link your email to continue.
              </Text>
              <Button
                className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
                disabled={isSubmitting}
                disabledClass="opacity-[0.5]"
                onClick={resendEmail}
                type={ButtonTypeEnum.SUBMIT}
              >
                <Text className="font-medium" fontSize={16}>
                  Resend Verification Email
                </Text>
              </Button>
              {hasResentEmail && (
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  We have resent an email to you to verify your email address.
                </Text>
              )}
            </>
          ) : (
            <>
              <Text
                className="mb-4 w-[360px] text-center font-semibold text-white"
                fontSize={36}
              >
                Let&apos;s get to know each other
              </Text>
              <form
                className="flex flex-col gap-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col">
                  <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                    Email address
                  </Text>
                  <Input
                    className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                    errors={errors}
                    name="email"
                    options={{
                      required: true
                    }}
                    placeholder="Enter your email address"
                    register={register}
                    type="text"
                  />
                </div>

                <Button
                  className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
                  disabled={isSubmitting}
                  disabledClass="opacity-[0.5]"
                  type={ButtonTypeEnum.SUBMIT}
                >
                  <Text className="font-medium" fontSize={16}>
                    Register account
                  </Text>
                  <EnterIcon />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithLoginPageLayout(SignupEmailPage)
