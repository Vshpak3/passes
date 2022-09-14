import { AuthApi } from "@passes/api-client/apis"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { wrapApi } from "src/helpers/wrapApi"

import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "../../helpers/authRouter"
import { setTokens } from "../../helpers/setTokens"
import { useUser } from "../../hooks"

export type UserInfoFormValues = {
  legalFullName: string
  username: string
  countryCode: string
  birthday: string
}

const UserInfoPage = () => {
  const {
    userClaims,
    setAccessToken,
    setRefreshToken,
    mutate: refreshUser
  } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserInfoFormValues>()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    authRouter(router, userClaims)
  }, [router, userClaims])

  const onUserRegister = async (
    name: string,
    username: string,
    countryCode: string,
    birthday: string
  ) => {
    try {
      const api = wrapApi(AuthApi)
      const res = await api.createUser({
        createUserRequestDto: {
          legalFullName: name,
          username: username,
          countryCode: countryCode,
          birthday: birthday
        }
      })

      const setRes = setTokens(
        setAccessToken,
        setRefreshToken,
        res.accessToken,
        res.refreshToken
      )
      if (!setRes) {
        alert("ERROR: Received no access token")
      }

      refreshUser()

      router.push(authStateToRoute(AuthStates.AUTHED))
    } catch (err: unknown) {
      alert(err)
    }
  }

  const onSubmit = (data: Record<string, string>) => {
    onUserRegister(
      data.legalFullName,
      data.username,
      iso3311a2.getCode(data.countryCode),
      data.birthday
    )
  }

  // const isOver18 = (): string => {
  //   const today = new Date()
  //   const eighteenYearsAgo = today.setFullYear(today.getFullYear() - 18)
  //   return new Date(eighteenYearsAgo).toISOString().split("T")[0]
  // }

  return (
    // Do not use AuthOnlyWrapper, login/signup flow uses custom routing
    <div className=" flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/userInfoBackground.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          <Text
            fontSize={36}
            className="mb-4 w-[360px] text-center font-semibold text-white"
          >
            Let&apos;s get to know each other
          </Text>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-5"
          >
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Your name
              </Text>
              <FormInput
                register={register}
                name="legalFullName"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your name"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              {errors.legalFullName && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.legalFullName.message}
                </Text>
              )}
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Username
              </Text>
              <FormInput
                register={register}
                name="username"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your username"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              {errors.username && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.username.message}
                </Text>
              )}
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Birthday
              </Text>
              <FormInput
                register={register}
                name="birthday"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your birthday"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              {errors.birthday && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.birthday.message}
                </Text>
              )}
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">Country</Text>
              <FormInput
                register={register}
                name="countryCode"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your country"
                type="select"
                selectOptions={iso3311a2.getCountries()}
                errors={errors}
                options={{
                  required: true
                }}
              />
              {errors.countryCode && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.countryCode.message}
                </Text>
              )}
            </div>

            <button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              type="submit"
            >
              <Text fontSize={16} className="font-medium">
                Register account
              </Text>
              <EnterIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
