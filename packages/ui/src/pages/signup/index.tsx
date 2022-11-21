import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import Link from "next/link"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import EnterPurpleIcon from "public/icons/enter-icon-purple.svg"
import FacebookLogo from "public/icons/facebook-logo.svg"
import GoogleLogo from "public/icons/google-logo.svg"
import TwitterLogo from "public/icons/twitter-logo.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { object, SchemaOf } from "yup"

import {
  Button,
  ButtonTypeEnum,
  ButtonVariant
} from "src/components/atoms/button/Button"
import { RoundedIconButton } from "src/components/atoms/button/RoundedIconButton"
import { Input } from "src/components/atoms/input/GeneralInput"
import { PasswordInput } from "src/components/atoms/input/PasswordInput"
import { Text } from "src/components/atoms/Text"
import { SignupTiles } from "src/components/molecules/SignupTiles"
import { authRouter } from "src/helpers/authRouter"
import { errorMessage } from "src/helpers/error"
import { emailSchema } from "src/helpers/validation/email"
import { passwordSchema } from "src/helpers/validation/password"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

export interface SignupInitialPageSchema {
  email: string
  password: string
  confirmPassword: string
}

const signupInitialPageSchema: SchemaOf<SignupInitialPageSchema> = object({
  ...emailSchema,
  ...passwordSchema
})

const SignupInitialPage: FC = () => {
  const router = useRouter()
  const { safePush } = useSafeRouter()
  const { auth } = useAuthEvent()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupInitialPageSchema>({
    resolver: yupResolver(signupInitialPageSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initiateSignup = async (email: string, password: string) => {
    await auth(
      async () => {
        const api = new AuthLocalApi()
        return await api.createEmailPasswordUser({
          createLocalUserRequestDto: { email, password }
        })
      },
      async () => undefined,
      async (token: string) => {
        authRouter(safePush, token, false, [["email", email]])
      }
    )
  }

  const onSubmit = async (values: SignupInitialPageSchema) => {
    try {
      setIsSubmitting(true)
      await initiateSignup(values.email, values.password)
    } catch (error: unknown) {
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  const handleLoginWithGoogle = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google")
  }

  const handleLoginWithTwitter = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/twitter")
  }

  const handleLoginWithFacebook = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/facebook")
  }

  return (
    <div className="h-screen bg-black">
      <div className="relative mx-auto flex h-full max-w-[1440px] justify-center px-4 pt-12 md:pt-16 lg:items-center lg:justify-between lg:px-16 lg:pt-0 xl:px-[170px] 2xl:px-[200px]">
        <span className="absolute top-[136px] left-0 hidden h-[650px] w-[650px] items-center justify-center lg:flex xl:left-12 xl:h-[751px] xl:w-[751px]">
          <span className="absolute h-full w-full bg-[conic-gradient(from_133.17deg_at_43.11%_51.11%,#F2BD6C_0deg,#BD499B_230.62deg,#A359D5_360deg)] opacity-60 blur-[125px]" />
          <span className="absolute h-[73%] w-[73%] rounded-full border-[41px] border-white/[0.15]" />
        </span>
        <div className="hidden justify-center lg:flex">
          <SignupTiles />
        </div>

        <div className="mb-8 flex flex-col items-center gap-y-5">
          <Text className="mb-4 font-[500] text-white" fontSize={36}>
            Create an account
          </Text>
          <Text className="-mt-8 text-[#b3bee7] opacity-[0.75]">
            Please enter your details.
          </Text>
          <form
            className="flex flex-col gap-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Email</Text>
              <Input
                autoComplete="email"
                className="w-[340px] xs:w-[360px]"
                errors={errors}
                name="email"
                outlineColor="purple"
                placeholder="Enter your email"
                register={register}
                transparent={false}
                type="email"
              />
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Password
              </Text>
              <PasswordInput
                autoComplete="current-password"
                className="w-[340px] xs:w-[360px]"
                errors={errors}
                name="password"
                outlineColor="purple"
                placeholder="Enter your password"
                register={register}
                transparent={false}
              />
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                Confirm Password
              </Text>
              <PasswordInput
                autoComplete="current-password"
                className="w-[340px] xs:w-[360px]"
                errors={errors}
                name="confirmPassword"
                outlineColor="purple"
                placeholder="Confirm your password"
                register={register}
                transparent={false}
              />
            </div>

            <Button
              className="z-10 flex h-[44px] w-[340px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9 xs:w-[360px]"
              disabled={isSubmitting}
              disabledClass="opacity-[0.5]"
              type={ButtonTypeEnum.SUBMIT}
              variant={ButtonVariant.NONE}
            >
              <Text className="font-medium" fontSize={16}>
                Register account
              </Text>
              <EnterIcon />
            </Button>
          </form>
          <div className="z-10 flex gap-[17px]">
            <RoundedIconButton
              icon={GoogleLogo}
              onClick={handleLoginWithGoogle}
            />
            <RoundedIconButton
              icon={FacebookLogo}
              onClick={handleLoginWithFacebook}
            />
            <RoundedIconButton
              icon={TwitterLogo}
              onClick={handleLoginWithTwitter}
            />
          </div>

          <Text
            className="z-10 w-[340px] text-[#b3bee7] opacity-[0.75] xs:w-[360px]"
            fontSize={13}
          >
            By signing up, you agree to Passes&apos;{" "}
            <a
              className="text-blue-blue10"
              href="/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              className="text-blue-blue10"
              href="/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </Text>

          <Text
            className="z-10 flex w-[340px] justify-center text-[#b3bee7] opacity-[0.75] xs:w-[360px]"
            fontSize={13}
          >
            Have an account?
            <Link className="flex flex-row items-center gap-1" href="/login">
              <p className="z-10 ml-1 inline cursor-pointer select-none bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 bg-clip-text text-transparent">
                Sign In
              </p>
              <EnterPurpleIcon />
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default WithLoginPageLayout(SignupInitialPage, {
  routeOnTokenChange: false,
  routeOnlyIfAuth: true
})
