import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi } from "@passes/api-client/apis"
import ms from "ms"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { SignupFooter } from "src/components/atoms/signup/SignupFooter"
import { Text } from "src/components/atoms/Text"
import { isDev } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { StandAlonePage } from "src/layout/StandAlonePage"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

const RESEND_WAIT_TIME = 60

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

  const [hasSentEmail, setHasSentEmail] = useState(false)
  const [hasResentEmail, setHasResentEmail] = useState(false)
  const [timeLeft, setTimeLeft] = useState(RESEND_WAIT_TIME)

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    setHasSentEmail(!!router.query.email)
  }, [router])

  useEffect(() => {
    if (!hasResentEmail) {
      return
    }

    if (timeLeft !== 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, ms("1 second"))
      return () => clearInterval(timer)
    } else {
      setHasResentEmail(false)
      setTimeLeft(RESEND_WAIT_TIME)
    }
  }, [hasResentEmail, timeLeft])

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

    router.query.email = email
    router.push(router)
  }

  const resendEmail = async () => {
    setHasResentEmail(false)

    const api = new AuthApi()
    try {
      await api.setUserEmail({
        setEmailRequestDto: { email: router.query.email as string }
      })
      setHasResentEmail(true)
    } catch (err) {
      errorMessage(err)
    }
  }

  const onSubmit = (values: SignupEmailPageSchema) => {
    try {
      setIsSubmitting(true)
      verifyEmail(values.email)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  return (
    <StandAlonePage className="h-[30vh] w-[100vw] max-w-[750px]">
      {hasSentEmail ? (
        <>
          <Text
            className="mb-4 w-full text-center font-[500] text-white"
            fontSize={36}
          >
            Email sent!
          </Text>
          <Text className="mx-1 pb-2 text-[#b3bee7] opacity-[0.75]">
            We have sent an email to you to verify your email address. <br />
            Please click in the link your email to continue.
          </Text>
          <Button
            disabled={hasResentEmail}
            disabledClass="opacity-[0.5]"
            onClick={resendEmail}
            type={ButtonTypeEnum.SUBMIT}
          >
            <Text className="font-medium" fontSize={16}>
              {!hasResentEmail ? (
                <>Resend Verification Email</>
              ) : (
                <>Please wait {timeLeft} seconds to resend</>
              )}
            </Text>
          </Button>
          {hasResentEmail && (
            <Text className="my-3 text-[#b3bee7] opacity-[0.75]">
              We have resent an email to you to verify your email address.
            </Text>
          )}
          <SignupFooter disabled={isSubmitting} />
        </>
      ) : (
        <>
          <Text
            className="mb-4 w-full text-center font-[500] text-white"
            fontSize={36}
          >
            Let&apos;s get to know each other
          </Text>
          <form
            className="flex flex-col gap-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-start">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Email address
              </Text>
              <Input
                className="w-[360px]"
                errors={errors}
                name="email"
                placeholder="Enter your email address"
                register={register}
                transparent={false}
                type="text"
              />
            </div>

            <Button
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
          <SignupFooter disabled={isSubmitting} />
        </>
      )}
    </StandAlonePage>
  )
}

export default WithLoginPageLayout(SignupEmailPage, {
  refreshUnverifiedToken: true
})
