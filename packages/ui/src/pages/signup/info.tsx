import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi, UserApi } from "@passes/api-client/apis"
import { differenceInYears, format, subYears } from "date-fns"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useEffect, useState } from "react"
import { Calendar } from "react-date-range"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import {
  Button,
  ButtonTypeEnum,
  FormInput,
  Text,
  Wordmark
} from "src/components/atoms"
import {
  authRouter,
  AuthStates,
  authStateToRoute
} from "src/helpers/authRouter"
import { COUNTRIES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"
import { setTokens } from "src/helpers/setTokens"
import { checkUsername } from "src/helpers/username"
import { useUser } from "src/hooks"
import { object, SchemaOf, string } from "yup"

const BIRTHDAY_MIN_AGE_IN_YEARS = 13
const BIRTHDAY_DATE_FORMAT = "yyyy-MM-dd"

export type SignupInfoPageSchema = {
  legalFullName: string
  username: string
  countryCode: string
  birthday: string
}

const signupInfoPageSchema: SchemaOf<SignupInfoPageSchema> = object({
  legalFullName: string().required("Enter your full name"),
  username: string().required("Enter a username"),
  birthday: string()
    .required("Enter your birthday")
    .test(
      "birthday-age",
      `You must be at least ${BIRTHDAY_MIN_AGE_IN_YEARS} to sign up`,
      (value) =>
        value !== undefined &&
        differenceInYears(new Date(), new Date(value)) >=
          BIRTHDAY_MIN_AGE_IN_YEARS
    ),
  countryCode: string().required("Enter your coutnry")
})

const SignupInfoPage: FC = () => {
  const router = useRouter()
  const { userClaims, setAccessToken, setRefreshToken } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch
  } = useForm<SignupInfoPageSchema>({
    resolver: yupResolver(signupInfoPageSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    authRouter(router, userClaims)
  }, [router, userClaims])

  const createNewUser = async (
    name: string,
    username: string,
    countryCode: string,
    birthday: string
  ) => {
    try {
      const api = new AuthApi()
      const userApi = new UserApi()

      const validUsername = await checkUsername(username, userApi)
        .then(() => true)
        .catch((err: Error) => {
          setError("username", { message: err.message })
          return false
        })

      if (!validUsername) {
        setIsSubmitting(false)
        return
      }

      toast.info("Please wait a moment while we create your account")

      const res = await api.createUser({
        createUserRequestDto: {
          legalFullName: name,
          username: username,
          countryCode: countryCode,
          birthday: birthday
        }
      })

      toast.dismiss()

      const setRes = setTokens(res, setAccessToken, setRefreshToken)
      if (!setRes) {
        return
      }

      router.push(authStateToRoute(AuthStates.AUTHED))
    } catch (err: any) {
      toast.dismiss()
      errorMessage(err, true)
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: SignupInfoPageSchema) => {
    setIsSubmitting(true)
    createNewUser(
      data.legalFullName,
      data.username,
      iso3311a2.getCode(data.countryCode),
      data.birthday
    )
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
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
                }}
              />
              {isCalendarVisible && (
                <>
                  <Calendar
                    date={calendarDate}
                    minDate={subYears(new Date(), 100)}
                    maxDate={new Date()}
                    onChange={(e: Date) => {
                      setCalendarDate(e)
                      setValue("birthday", format(e, BIRTHDAY_DATE_FORMAT))
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
            </div>

            <Button
              className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              tag="button"
              type={ButtonTypeEnum.SUBMIT}
              disabled={isSubmitting}
              disabledClass="opacity-[0.5]"
            >
              <Text fontSize={16} className="font-medium">
                Register account
              </Text>
              <EnterIcon />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupInfoPage
