import { AuthLocalApi } from "@passes/api-client"
import NextLink from "next/link"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import EnterPurpleIcon from "public/icons/enter-icon-purple.svg"
import FacebookLogo from "public/icons/facebook-logo.svg"
import GoogleLogo from "public/icons/google-logo.svg"
import TwitterLogo from "public/icons/twitter-logo.svg"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"

import { RoundedIconButton } from "../../components/atoms/Button"
import { GridTile, GridTileSm } from "../../components/molecules/CssGridTiles"
import { wrapApi } from "../../helpers/wrapApi"

const SignupPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const onUserRegister = async (email, password) => {
    try {
      const createLocalUserDto = {
        email: email,
        password: password
      }

      const api = wrapApi(AuthLocalApi)
      const res = await api.localAuthCreateEmailPasswordUser({
        createLocalUserDto
      })

      router.push("signup/user-info")
      console.log(res, "RESPONSE")
    } catch (err) {
      console.log(err, "CATCHED")
    }
  }

  const onSubmit = (data) => {
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
      <Wordmark height={28} width={122} className="self-center lg:self-start" />
      <div className="mt-10 flex md:mt-20 lg:my-auto">
        <div className="hidden flex-1 justify-center lg:flex">
          <GridTile />
        </div>

        <div className="flex flex-1 flex-col items-center gap-y-5">
          <Text fontSize={36} className="mb-4 font-semibold">
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
                className="w-[360px] border-[#34343A60] bg-black focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your email"
                type="text"
                errors={errors}
                options={{
                  required: true,
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address"
                  }
                }}
              />
              {errors.email && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.email.message}
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
                className="w-[360px] border-[#34343A60] bg-black focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your password"
                type="password"
                errors={errors}
                options={{
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Minimum eight characters"
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/,
                    message: "Must include at least one letter and one number "
                  }
                }}
              />
              {errors.password && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.password.message}
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
                className="w-[360px] border-[#34343A60] bg-black focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Confirm your password"
                type="password"
                errors={errors}
                options={{
                  required: true,
                  validate: (val) => {
                    if (watch("password") != val) {
                      return "Your passwords do not match"
                    }
                  },
                  minLength: {
                    value: 8,
                    message: "Minimum eight characters"
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/,
                    message: "Must include at least one letter and one number"
                  }
                }}
              />
              {errors.confirmPassword && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </div>

            <button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              type="submit"
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
            className="z-10 flex w-[360px] text-[#b3bee7] opacity-[0.6]"
          >
            By clicking the Register button, you agree to Moment&apos;s Terms &
            Conditions.
          </Text>

          <Text
            fontSize={13}
            className="z-10 flex w-[360px] justify-center text-[#b3bee7] opacity-[0.6]"
          >
            Have an account?
            <NextLink href="/login">
              <div className="z-10 ml-1 flex cursor-pointer select-none flex-row items-center gap-1 bg-gradient-to-r from-[#598BF4] to-[#B53BEC] bg-clip-text text-transparent">
                Sign In
                <EnterPurpleIcon />
              </div>
            </NextLink>
          </Text>
          <GridTileSm />
        </div>
      </div>
    </div>
  )
}

export default SignupPage
