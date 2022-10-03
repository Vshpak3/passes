import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import NextLink from "next/link"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import EnterPurpleIcon from "public/icons/enter-icon-purple.svg"
import FacebookLogo from "public/icons/facebook-logo.svg"
import GoogleLogo from "public/icons/google-logo.svg"
import TwitterLogo from "public/icons/twitter-logo.svg"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { RoundedIconButton } from "src/components/atoms/Button"
import { CssGridTiles } from "src/components/molecules"
import { authRouter } from "src/helpers/authRouter"
import { setTokens } from "src/helpers/setTokens"
import { useUser } from "src/hooks"
import { JWTUserClaims } from "src/hooks/useUser"
import { object, SchemaOf, string } from "yup"

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
    .min(8, "Password should be at least 8 characters")
})

const LoginPage = () => {
  const router = useRouter()
  const { userClaims, setAccessToken, setRefreshToken } = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({ resolver: yupResolver(loginPageSchema) })

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    authRouter(router, userClaims)
  }, [router, userClaims])

  const handleLoginWithGoogle = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google")
  }

  const handleLoginWithTwitter = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/twitter")
  }

  const handleLoginWithFacebook = async () => {
    router.push(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/facebook")
  }

  const onUserLogin = async (email: string, password: string) => {
    try {
      const api = new AuthLocalApi()
      const res = await api.loginWithEmailPassword({
        localUserLoginRequestDto: { email, password }
      })

      const setRes = setTokens(res, setAccessToken, setRefreshToken)
      if (!setRes) {
        setError("submitError", {
          type: "custom",
          message: "ERROR: Received no access token"
        })
        return
      }

      authRouter(router, jwtDecode<JWTUserClaims>(res.accessToken))
    } catch (error) {
      setError("submitError", {
        type: "custom",
        message: "Invalid credentials"
      })
    }
  }

  const onSubmit = async (data: Record<string, string>) => {
    await onUserLogin(data.email, data.password)
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="self-center lg:self-start"
      />
      <div className="mt-10 flex md:mt-20 lg:my-auto">
        <div className="hidden flex-1 justify-center lg:flex">
          <CssGridTiles />
        </div>

        <div className="flex flex-1 flex-col items-center gap-y-5">
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
              <FormInput
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
              <FormInput
                register={register}
                name="password"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your password"
                type="password"
                errors={errors}
              />
            </div>

            <div className="flex flex-row gap-14">
              <FormInput
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

            <button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              type="submit"
            >
              <Text fontSize={16} className="font-medium">
                Login
              </Text>
              <EnterIcon />
            </button>
            <div className="text-center text-red-500">
              {errors.submitError && errors.submitError.message?.toString()}
            </div>
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

export default LoginPage
