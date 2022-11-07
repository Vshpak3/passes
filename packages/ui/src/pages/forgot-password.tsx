import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Wordmark } from "src/components/atoms/Wordmark"
import { isDev } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { sleep } from "src/helpers/sleep"
import { emailFormSchema } from "./signup"

export interface ForgotPasswordFormProps {
  email: string
}

const forgotPasswordFormSchema: SchemaOf<ForgotPasswordFormProps> = object({
  ...emailFormSchema
})

const ForgotPassword = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormProps>({
    resolver: yupResolver(forgotPasswordFormSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const resetPassword = async (email: string) => {
    const api = new AuthLocalApi()
    await api.initPasswordReset({
      initResetPasswordRequestDto: { email }
    })

    setEmailSent(true)

    // In local development we auto-verify the email
    if (isDev) {
      await sleep("1 second")
      router.push("/reset-password?token=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
    }
  }

  const onSubmit = async (data: ForgotPasswordFormProps) => {
    try {
      setIsSubmitting(true)
      await resetPassword(data.email)
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
          <Text
            className="mb-4 w-[360px] text-center font-semibold text-white"
            fontSize={36}
          >
            Forgot Password
          </Text>
          {emailSent ? (
            <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
              Check your email for a link to reset your password. If it doesn’t
              appear within a few minutes, check your spam folder.
            </Text>
          ) : (
            <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
              Enter your email address and we will send you a link to reset your
              password.
            </Text>
          )}
          {!emailSent && (
            <form
              className="flex flex-col gap-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">Email</Text>
                <Input
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="email"
                  placeholder="Enter your email"
                  register={register}
                  type="text"
                />
              </div>

              <Button
                className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
                disabled={isSubmitting}
                disabledClass="opacity-[0.5]"
                tag="button"
                type={ButtonTypeEnum.SUBMIT}
              >
                <Text className="font-medium" fontSize={16}>
                  Reset Password
                </Text>
                <EnterIcon />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword // no WithLoginPageLayout
