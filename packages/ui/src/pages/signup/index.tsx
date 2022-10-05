import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi, AuthLocalApi } from "@passes/api-client"
import jwtDecode from "jwt-decode"
import NextLink from "next/link"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import EnterPurpleIcon from "public/icons/enter-icon-purple.svg"
import FacebookLogo from "public/icons/facebook-logo.svg"
import GoogleLogo from "public/icons/google-logo.svg"
import TwitterLogo from "public/icons/twitter-logo.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput, Text } from "src/components/atoms"
import { RoundedIconButton } from "src/components/atoms/Button"
import { SignupTiles } from "src/components/molecules"
import { authRouter } from "src/helpers/authRouter"
import { isDev } from "src/helpers/env"
import { setTokens } from "src/helpers/setTokens"
import { useUser } from "src/hooks"
import { JWTUserClaims } from "src/hooks/useUser"
import { object, SchemaOf, string } from "yup"

export interface SignupPageSchema {
  email: string
  password: string
  confirmPassword: string
}

const signupPageSchema: SchemaOf<SignupPageSchema> = object({
  email: string()
    .required("Enter an email address")
    .email("Email address is invalid"),
  password: string()
    .required("Enter a password")
    .min(8, "Password should be at least 8 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/,
      "Password must contain at least one letter and number"
    ),
  confirmPassword: string()
    .required("Enter a password")
    .min(8, "Password should be at least 8 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/,
      "Password must contain at least one letter and number"
    )
    .test("match", "Passwords do not match", function (confirmPassword) {
      return confirmPassword === this?.parent?.password
    })
})

const SignupPage = () => {
  const router = useRouter()
  const { setAccessToken, setRefreshToken, userClaims } = useUser()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<SignupPageSchema>({
    resolver: yupResolver(signupPageSchema)
  })

  useEffect(() => {
    if (!router.isReady || hasLoaded) {
      return
    }

    authRouter(router, userClaims, true)
    setHasLoaded(true)
  }, [router, userClaims, hasLoaded])

  const onUserRegister = async (email: string, password: string) => {
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const api = new AuthLocalApi()
      const res = await api.createEmailPasswordUser({
        createLocalUserRequestDto: { email, password }
      })
      const setRes = setTokens(res, setAccessToken, setRefreshToken)
      if (!setRes) {
        toast("Something went wrong, please try again later")
        console.error("Failed to set tokens after signup")
      }

      // In local development we auto-verify the email
      if (isDev) {
        const authApi = new AuthApi()
        const res = await authApi.verifyUserEmail({
          verifyEmailDto: {
            verificationToken: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
          }
        })
        setTokens(res, setAccessToken, setRefreshToken)
      }

      authRouter(
        router,
        jwtDecode<JWTUserClaims>(res.accessToken),
        false,
        new URLSearchParams([["hasEmail", "true"]])
      )
    } catch (err) {
      toast("Something went wrong, please try again later")
      console.error("Error on signup", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: SignupPageSchema) => {
    onUserRegister(data.email, data.password)
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
      <div className="relative mx-auto flex h-full max-w-[1440px] justify-center px-4 pt-16 md:pt-[104px] lg:items-center lg:justify-between lg:px-16 lg:pt-0 xl:px-[170px] 2xl:px-[200px]">
        <span className="absolute top-[136px] left-0 hidden h-[650px] w-[650px] items-center justify-center lg:flex xl:left-12 xl:h-[751px] xl:w-[751px]">
          <span className="absolute h-full w-full bg-[conic-gradient(from_133.17deg_at_43.11%_51.11%,#F2BD6C_0deg,#BD499B_230.62deg,#A359D5_360deg)] opacity-60 blur-[125px]" />
          <span className="absolute h-[73%] w-[73%] rounded-full border-[41px] border-white/[0.15]" />
        </span>
        <div className="hidden justify-center lg:flex">
          <SignupTiles />
        </div>

        <div className="flex flex-col items-center gap-y-5">
          <Text fontSize={36} className="mb-4 font-semibold text-white">
            Create an account
          </Text>
          <Text className="-mt-8 text-[#b3bee7] opacity-[0.6]">
            Please enter your details.
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
                className="w-[340px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180] xs:w-[360px]"
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
                className="w-[340px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180] xs:w-[360px]"
                placeholder="Enter your password"
                type="password"
                errors={errors}
              />
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Confirm Password
              </Text>
              <FormInput
                register={register}
                name="confirmPassword"
                className="w-[340px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180] xs:w-[360px]"
                placeholder="Confirm your password"
                type="password"
                errors={errors}
              />
            </div>

            <button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[340px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9 xs:w-[360px]"
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
            >
              <Text fontSize={16} className="font-medium">
                Register account
              </Text>
              <EnterIcon />
            </button>
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
            className="z-10 w-[340px] text-[#b3bee7] opacity-[0.6] xs:w-[360px]"
          >
            By signing up, you agree to Passes&apos;{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-blue10"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-blue10"
            >
              Privacy Policy
            </a>
            .
          </Text>

          <Text
            fontSize={13}
            className="z-10 flex w-[340px] justify-center text-[#b3bee7] opacity-[0.6] xs:w-[360px]"
          >
            Have an account?
            <NextLink href="/login">
              <div className="z-10 ml-1 flex cursor-pointer select-none flex-row items-center gap-1 bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 bg-clip-text text-transparent">
                Sign In
                <EnterPurpleIcon />
              </div>
            </NextLink>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
