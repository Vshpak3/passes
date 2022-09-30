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
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { useUser } from "src/hooks"
import { object, SchemaOf, string } from "yup"

import { RoundedIconButton } from "../../components/atoms/Button"
import { CssGridTiles } from "../../components/molecules"
import { authRouter } from "../../helpers/authRouter"
import { isDev } from "../../helpers/env"
import { setTokens } from "../../helpers/setTokens"
import { JWTUserClaims } from "../../hooks/useUser"

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
    formState: { errors }
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
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your email"
                type="text"
                errors={errors}
              />
              {errors.email && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.email.message?.toString()}
                </Text>
              )}
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
              {errors.password && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.password.message?.toString()}
                </Text>
              )}
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Confirm Password
              </Text>
              <FormInput
                register={register}
                name="confirmPassword"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Confirm your password"
                type="password"
                errors={errors}
              />
              {errors.confirmPassword && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.confirmPassword.message?.toString()}
                </Text>
              )}
            </div>

            <button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              type="submit"
              disabled={isSubmitting}
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
            className="z-10 w-[360px] text-[#b3bee7] opacity-[0.6]"
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
            className="z-10 flex w-[360px] justify-center text-[#b3bee7] opacity-[0.6]"
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
