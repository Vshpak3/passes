import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { PasswordInput } from "src/components/atoms/input/PasswordInput"
import { Text } from "src/components/atoms/Text"
import { Wordmark } from "src/components/atoms/Wordmark"
import { errorMessage } from "src/helpers/error"
import { sleep } from "src/helpers/sleep"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"
import { passwordFormSchema } from "./signup"

export interface ResetPasswordFormProps {
  password: string
  confirmPassword: string
}

const resetPasswordFormSchema: SchemaOf<ResetPasswordFormProps> = object({
  ...passwordFormSchema
})

const ResetPassword = () => {
  const router = useRouter()
  const { safePush } = useSafeRouter()
  const { auth } = useAuthEvent()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormProps>({
    resolver: yupResolver(resetPasswordFormSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [passwordReset, setPasswordReset] = useState(false)

  useEffect(() => {
    if (router.isReady && !router.query.token) {
      safePush("/login")
    }

    // We cannot add userClaims here since then this would trigger during the
    // update and we won't have time to show the confirmation screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const resetPassword = async (password: string) => {
    const verificationToken = router.query.token as string

    await auth(
      async () => {
        const api = new AuthLocalApi()
        return await api.confirmPasswordReset({
          confirmResetPasswordRequestDto: { password, verificationToken }
        })
      },
      async () => {
        setPasswordReset(true)
        // sleep for 2 seconds so the confirmation screen is visible before we redirect
        await sleep("2 seconds")
      }
    )
  }

  const onSubmit = async (data: ResetPasswordFormProps) => {
    try {
      setIsSubmitting(true)
      await resetPassword(data.password)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        whiteOnly
        height={28}
        width={122}
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]" />
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          <Text
            fontSize={36}
            className="mb-4 w-[360px] text-center font-semibold text-white"
          >
            Password Reset
          </Text>
          {passwordReset ? (
            <>
              <Text className="-mt-6 flex flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
                Success! Your password has been changed.
              </Text>
              <Text className="flex flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
                We will automatically log you in. Alternatively, click here to
                log in.
              </Text>
              <button
                onClick={() => router.push("/login")}
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              >
                <Text fontSize={16} className="font-medium">
                  Log in
                </Text>
                <EnterIcon />
              </button>
            </>
          ) : (
            <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
              Please enter your new password and confirm it.
            </Text>
          )}
          {!passwordReset && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Password
                </Text>
                <PasswordInput
                  register={register}
                  name="password"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter your password"
                  errors={errors}
                />
              </div>

              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Confirm Password
                </Text>
                <PasswordInput
                  register={register}
                  name="confirmPassword"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Confirm your password"
                  errors={errors}
                />
              </div>

              <Button
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                tag="button"
                type={ButtonTypeEnum.SUBMIT}
                disabled={isSubmitting}
                disabledClass="opacity-[0.5]"
              >
                <Text fontSize={16} className="font-medium">
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

export default WithLoginPageLayout(ResetPassword, { routeOnlyIfAuth: true })
