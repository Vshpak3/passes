import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi } from "@passes/api-client/apis"
import { differenceInYears, format, subYears } from "date-fns"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import jwtDecode from "jwt-decode"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useState } from "react"
import { Calendar } from "react-date-range"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Select } from "src/components/atoms/input/Select"
import { Text } from "src/components/atoms/Text"
import { Wordmark } from "src/components/atoms/Wordmark"
import { MIN_USER_AGE_IN_YEARS } from "src/config/age"
import { COUNTRIES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"
import { checkUsername } from "src/helpers/username"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { JWTUserClaims, useUser } from "src/hooks/useUser"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

const BIRTHDAY_DATE_FORMAT = "yyyy-MM-dd"

export type SignupInfoPageSchema = {
  legalFullName: string
  username: string
  countryCode: string
  birthday: string
  displayName: string
}

const FULL_NAME_REGEX = /^[A-Za-z-,'\s]+$/

const signupInfoPageSchema: SchemaOf<SignupInfoPageSchema> = object({
  legalFullName: string()
    .required("Enter your full name")
    .matches(
      FULL_NAME_REGEX,
      "Only letters and symbols (- , ') are allowed for your name"
    ),
  username: string().required("Enter a username"),
  birthday: string()
    .required("Enter your birthday")
    .test(
      "birthday-age",
      `You must be at least ${MIN_USER_AGE_IN_YEARS} to sign up`,
      (value) =>
        value !== undefined &&
        differenceInYears(new Date(), new Date(value)) >= MIN_USER_AGE_IN_YEARS
    ),
  countryCode: string().required("Enter your country"),
  displayName: string().required("Enter a display name")
})

const SignupInfoPage: FC = () => {
  const { mutateManual } = useUser()
  const { auth } = useAuthEvent(false)

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

  const createNewUser = async (
    name: string,
    username: string,
    countryCode: string,
    birthday: string,
    displayName: string
  ) => {
    try {
      const validUsername = await checkUsername(username)
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

      const newUserPayload = {
        legalFullName: name,
        username: username,
        countryCode: countryCode,
        birthday: birthday,
        displayName: displayName
      }

      await auth(
        async () => {
          const api = new AuthApi()
          return await api.createUser({
            createUserRequestDto: newUserPayload
          })
        },
        async (token) => {
          // If we mutate immedately there might not be a user entry in the db reader
          // so instead reader so we instead maually construct mutate the user.
          mutateManual({
            userId: jwtDecode<JWTUserClaims>(token).sub,
            email: "", // TODO: return this from the api or get elsewhere
            ...newUserPayload
          })
        }
      )
    } catch (error: unknown) {
      toast.dismiss()
      errorMessage(error, true)
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: SignupInfoPageSchema) => {
    setIsSubmitting(true)
    createNewUser(
      data.legalFullName,
      data.username,
      iso3311a2.getCode(data.countryCode),
      data.birthday,
      data.displayName
    )
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 md:pt-6 lg:px-20">
      <Wordmark
        height={28}
        width={122}
        whiteOnly
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] pt-8 opacity-[60] md:border md:py-[3%]">
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
              <Input
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
              <Input
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
                Display Name
              </Text>
              <Input
                register={register}
                name="displayName"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your display name"
                type="text"
                errors={errors}
                options={{
                  required: {
                    value: true,
                    message: "Display name is required"
                  }
                }}
              />
            </div>

            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Birthday
              </Text>
              <Input
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
              <Select
                register={register}
                name="countryCode"
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Enter your country"
                selectOptions={COUNTRIES}
                errors={errors}
                options={{
                  required: {
                    value: true,
                    message: "Country is required"
                  }
                }}
                onChange={(newValue: string) =>
                  setValue("countryCode", newValue)
                }
                showOnTop
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

export default WithLoginPageLayout(SignupInfoPage)
