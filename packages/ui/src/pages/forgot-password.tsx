import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { memo, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { isDev } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { sleep } from "src/helpers/sleep"
import { emailSchema } from "src/helpers/validation/email"
import { WithStandAlonePageLayout } from "src/layout/WithStandAlonePageLayout"

export interface ForgotPasswordFormProps {
  email: string
}

const forgotPasswordFormSchema: SchemaOf<ForgotPasswordFormProps> = object({
  ...emailSchema
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

  const onSubmit = async (values: ForgotPasswordFormProps) => {
    try {
      setIsSubmitting(true)
      await resetPassword(values.email)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <Text className="mb-16 text-center font-[500] text-white" fontSize={36}>
        Forgot Password
      </Text>
      {emailSent ? (
        <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.75]">
          Check your email for a link to reset your password. If it doesn’t
          appear within a few minutes, check your spam folder.
        </Text>
      ) : (
        <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.75]">
          Enter your email address and we will send you a link to reset your
          password.
        </Text>
      )}
      {!emailSent && (
        <form
          className="flex flex-col gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Email</Text>
            <Input
              autoComplete="email"
              className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
              errors={errors}
              name="email"
              placeholder="Enter your email"
              register={register}
              transparent={false}
              type="email"
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
      )}
    </div>
  )
}

export default WithStandAlonePageLayout(memo(ForgotPassword), {
  className: "h-[30vh] w-[100vw] max-w-[750px] my-[15vh]"
}) // no WithLoginPageLayout
