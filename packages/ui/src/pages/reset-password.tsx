import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { PasswordInput } from "src/components/atoms/input/PasswordInput"
import { Text } from "src/components/atoms/Text"
import { errorMessage } from "src/helpers/error"
import { sleep } from "src/helpers/sleep"
import { passwordSchema } from "src/helpers/validation/password"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { StandAlonePage } from "src/layout/StandAlonePage"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

export interface ResetPasswordFormProps {
  password: string
  confirmPassword: string
}

const resetPasswordFormSchema: SchemaOf<ResetPasswordFormProps> = object({
  ...passwordSchema
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

  const onSubmit = async (values: ResetPasswordFormProps) => {
    try {
      setIsSubmitting(true)
      await resetPassword(values.password)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  return (
    <StandAlonePage className="my-[15vh] h-[30vh] w-[100vw] max-w-[750px]">
      <Text
        className="mb-4 w-[360px] text-center font-[500] text-white"
        fontSize={36}
      >
        Password Reset
      </Text>
      {passwordReset ? (
        <>
          <Text className="flex flex-wrap py-2 text-center text-[#b3bee7] opacity-[0.75]">
            Success! Your password has been changed.
          </Text>
          <Text className="flex flex-wrap py-2 text-center text-[#b3bee7] opacity-[0.75]">
            We will automatically log you in. Alternatively, click here to log
            in.
          </Text>
          <button
            className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
            onClick={() => safePush("/login")}
          >
            <Text className="font-medium" fontSize={16}>
              Log in
            </Text>
            <EnterIcon />
          </button>
        </>
      ) : (
        <>
          <Text className="flex flex-wrap pb-4 text-center text-[#b3bee7] opacity-[0.75]">
            Please enter your new password and confirm it.
          </Text>
          <form
            className="flex flex-col gap-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-start">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Password
              </Text>
              <PasswordInput
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="password"
                placeholder="Enter your password"
                register={register}
                transparent={false}
              />
            </div>

            <div className="flex flex-col items-start">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Confirm Password
              </Text>
              <PasswordInput
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="confirmPassword"
                placeholder="Confirm your password"
                register={register}
                transparent={false}
              />
            </div>

            <Button
              disabled={isSubmitting}
              disabledClass="opacity-[0.5]"
              type={ButtonTypeEnum.SUBMIT}
            >
              <Text className="font-medium" fontSize={16}>
                Reset Password
              </Text>
              <EnterIcon />
            </Button>
          </form>
        </>
      )}
    </StandAlonePage>
  )
}

export default WithLoginPageLayout(ResetPassword, { routeOnlyIfAuth: true })
