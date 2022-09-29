import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { AuthApi, UserApi } from "@passes/api-client/apis"
import { differenceInYears, format } from "date-fns"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useEffect, useState } from "react"
import { Calendar } from "react-date-range"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"

import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "../../helpers/authRouter"
import { COUNTRIES } from "../../helpers/countries"
import { setTokens } from "../../helpers/setTokens"
import { checkUsername } from "../../helpers/username"
import { useUser } from "../../hooks"

const MIN_AGE_IN_YEARS = 18
const DATE_FORMAT = "yyyy-MM-dd"

export type UserInfoFormValues = {
  legalFullName: string
  username: string
  countryCode: string
  birthday: string
  submitError: string
}

const UserInfoPage = () => {
  const router = useRouter()
  const {
    userClaims,
    setAccessToken,
    setRefreshToken,
    mutate: refreshUser
  } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch
  } = useForm<UserInfoFormValues>({
    defaultValues: { birthday: format(new Date(), DATE_FORMAT) }
  })

  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [hasTouchedCalendar, setHasTouchedCalendar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const api = new AuthApi()
      const userApi = new UserApi()

      const validUsername = await checkUsername(username, userApi)
        .then(() => true)
        .catch(() => {
          setError("username", {
            message: "ERROR: This username is unavailable."
          })
          return false
        })

      if (validUsername) {
        const res = await api.createUser({
          createUserRequestDto: {
            legalFullName: name,
            username: username,
            countryCode: countryCode,
            birthday: birthday
          }
        })

        const setRes = setTokens(res, setAccessToken, setRefreshToken)
        if (!setRes) {
          setError("submitError", {
            type: "custom",
            message: "ERROR: Received no access token"
          })
        }

        refreshUser()

        router.push(authStateToRoute(AuthStates.AUTHED))
      }
    } catch (err: unknown) {
      setError("submitError", {
        type: "custom",
        message: String(err)
      })
    } finally {
      setIsSubmitting(false)
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
                  required: {
                    value: true,
                    message: "Full name is required"
                  }
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
                  required: {
                    value: true,
                    message: "Username is required"
                  }
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
                // onChange is handled by the calendar
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                register={() => {}}
                value={watch("birthday")}
                name="birthday"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your birthday"
                type="text"
                errors={errors}
                options={{
                  required: {
                    value: true,
                    message: "Birthday is required"
                  }
                }}
                onFocus={() => {
                  setIsCalendarVisible(true)
                  setHasTouchedCalendar(true)
                }}
              />
              {isCalendarVisible && (
                <>
                  <Calendar
                    date={new Date(watch("birthday"))}
                    onChange={(e) => {
                      setValue("birthday", format(e, DATE_FORMAT))
                    }}
                  />
                  <button
                    className="border-t-2 border-t-slate-300 bg-white py-2 text-black"
                    onClick={() => setIsCalendarVisible(false)}
                  >
                    Done
                  </button>
                </>
              )}
              {errors.birthday && (
                <Text fontSize={12} className="mt-1 text-[red]">
                  {errors.birthday.message}
                </Text>
              )}
              {hasTouchedCalendar &&
                differenceInYears(new Date(), new Date(watch("birthday"))) <
                  MIN_AGE_IN_YEARS && (
                  <Text fontSize={12} className="mt-1 text-[red]">
                    You must be at least {MIN_AGE_IN_YEARS} to sign up.
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
                selectOptions={COUNTRIES}
                errors={errors}
                options={{
                  required: {
                    value: true,
                    message: "Country is required"
                  }
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
              disabled={isSubmitting}
            >
              <Text fontSize={16} className="font-medium">
                Register account
              </Text>
              <EnterIcon />
            </button>
            {errors.submitError && (
              <Text fontSize={12} className="mt-1 text-[red]">
                {errors.submitError.message}
              </Text>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
