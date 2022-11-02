import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
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
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
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
              <Button
                onClick={resendEmail}
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                tag="button"
                type={ButtonTypeEnum.SUBMIT}
                disabled={isSubmitting}
                disabledClass="opacity-[0.5]"
              >
                <Text fontSize={16} className="font-medium">
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
                  <Input
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
                </div>

                <Button
                  className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                  tag="button"
                  type={ButtonTypeEnum.SUBMIT}
                  disabled={isSubmitting}
                  disabledClass="opacity-[0.5]"
                >
                  <Text fontSize={16} className="font-medium">
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
