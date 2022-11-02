import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import NextLink from "next/link"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import EnterPurpleIcon from "public/icons/enter-icon-purple.svg"
import FacebookLogo from "public/icons/facebook-logo.svg"
import GoogleLogo from "public/icons/google-logo.svg"
import TwitterLogo from "public/icons/twitter-logo.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf, string } from "yup"

import {
  Button,
  ButtonTypeEnum,
  RoundedIconButton
} from "src/components/atoms/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Input } from "src/components/atoms/input/GeneralInput"
import { PasswordInput } from "src/components/atoms/input/PasswordInput"
import { Text } from "src/components/atoms/Text"
import { SignupTiles } from "src/components/molecules/SignupTiles"
import { errorMessage } from "src/helpers/error"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useUser } from "src/hooks/useUser"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"
import { deleteAllCookies } from "./logout"
import { PASSWORD_MIN_LENGTH } from "./signup"

export interface LoginPageSchema {
  email: string
  password: string
}

const loginPageSchema: SchemaOf<LoginPageSchema> = object({
  email: string()
    .required("Enter an email address")
    .email("Email address is invalid"),
  password: string()
    .required("Enter a password")
    .min(PASSWORD_MIN_LENGTH, "Password should be at least 8 characters")
})

const LoginPage: FC = () => {
  const router = useRouter()
  const { mutate } = useUser()
  const { auth } = useAuthEvent()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginPageSchema>({ resolver: yupResolver(loginPageSchema) })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginUser = async (email: string, password: string) => {
    await auth(
      async () => {
        const api = new AuthLocalApi()
        return await api.loginWithEmailPassword({
          localUserLoginRequestDto: { email, password }
        })
      },
      async () => {
        mutate()
      }
    )
  }

  const onSubmit = async (data: LoginPageSchema) => {
    try {
      setIsSubmitting(true)
      deleteAllCookies()
      await loginUser(data.email, data.password)
    } catch (error: unknown) {
      toast.error("Invalid credentials")
      console.error(await errorMessage(error))
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
    <div className="flex-2 h-screen bg-black">
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] justify-center pt-12 md:px-4 md:pt-16 md:pt-[104px] lg:items-center lg:justify-between lg:px-16 lg:pt-0 xl:px-[170px] 2xl:px-[200px]">
        <span className="absolute top-[136px] left-0 hidden h-[650px] w-[650px] items-center justify-center lg:flex xl:left-12 xl:h-[751px] xl:w-[751px]">
          <span className="absolute h-full w-full bg-[conic-gradient(from_133.17deg_at_43.11%_51.11%,#F2BD6C_0deg,#BD499B_230.62deg,#A359D5_360deg)] opacity-60 blur-[125px]" />
          <span className="absolute h-[73%] w-[73%] rounded-full border-[41px] border-white/[0.15]" />
        </span>
        <div className="hidden justify-center lg:flex">
          <SignupTiles />
        </div>

        <div className="flex flex-col items-center gap-y-5">
          <Text fontSize={36} className="mb-4 font-semibold text-white">
            Sign In
          </Text>
          <Text className="-mt-8 text-[#b3bee7] opacity-[0.6]">
            Welcome back!
          </Text>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">Email</Text>
              <Input
                register={register}
                name="email"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your email"
                type="text"
                errors={errors}
              />
            </div>

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

            <div className="flex flex-row gap-14">
              <Checkbox
                type="checkbox"
                label="Remember for 30 days"
                register={register}
                name="remember"
                errors={errors}
              />
              <Text className="ml-1 flex cursor-pointer select-none flex-row bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 bg-clip-text text-transparent">
                <NextLink href="/forgot-password">Forgot Password</NextLink>
              </Text>
            </div>

            <Button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              tag="button"
              type={ButtonTypeEnum.SUBMIT}
              disabled={isSubmitting}
              disabledClass="opacity-[0.5]"
            >
              <Text fontSize={16} className="font-medium">
                Login
              </Text>
              <EnterIcon />
            </Button>
          </form>

          <div className="z-10 flex gap-[17px]">
            <RoundedIconButton onClick={handleLoginWithGoogle}>
              <GoogleLogo />
            </RoundedIconButton>
            <RoundedIconButton onClick={handleLoginWithFacebook}>
              <FacebookLogo />
            </RoundedIconButton>
            <RoundedIconButton onClick={handleLoginWithTwitter}>
              <TwitterLogo />
            </RoundedIconButton>
          </div>

          <Text
            fontSize={13}
            className="z-10 flex w-[360px] justify-center text-[#b3bee7] opacity-[0.6]"
          >
            Don&apos;t have an account?
            <NextLink href="/signup">
              <div className="z-10 ml-1 flex cursor-pointer select-none flex-row items-center gap-1 bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 bg-clip-text text-transparent">
                Sign up
                <EnterPurpleIcon />
              </div>
            </NextLink>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default WithLoginPageLayout(LoginPage)
