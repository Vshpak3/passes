import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import ms from "ms"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { authRouter } from "src/helpers/authRouter"
import { isDev } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks"
import { object, SchemaOf } from "yup"

import { emailFormSchema } from "./signup"

export interface ForgotPasswordFormProps {
  email: string
}

const forgotPasswordFormSchema: SchemaOf<ForgotPasswordFormProps> = object({
  ...emailFormSchema
})

const ForgotPassword = () => {
  const router = useRouter()
  const { userClaims } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormProps>({
    resolver: yupResolver(forgotPasswordFormSchema)
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    authRouter(router, userClaims, true)
  }, [router, userClaims])

  const onSubmit = async (data: ForgotPasswordFormProps) => {
    try {
      const api = new AuthLocalApi()
      await api.initPasswordReset({
        initResetPasswordRequestDto: {
          email: data.email
        }
      })

      setEmailSent(true)

      // In local development we auto-verify the email
      if (isDev) {
        await new Promise((resolve) => setTimeout(resolve, ms("1 second"))) // sleep for a second
        router.push(
          "/reset-password?token=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        )
      }
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <div className=" flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        whiteOnly={true}
        height={28}
        width={122}
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          <Text
            fontSize={36}
            className="mb-4 w-[360px] text-center font-semibold text-white"
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
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">Email</Text>
                <FormInput
                  register={register}
                  name="email"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter your email"
                  type="text"
                  errors={errors}
                />
              </div>

              <button
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                type="submit"
                disabled={disableForm}
              >
                <Text fontSize={16} className="font-medium">
                  Reset Password
                </Text>
                <EnterIcon />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
