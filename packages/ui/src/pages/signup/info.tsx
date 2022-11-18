import { yupResolver } from "@hookform/resolvers/yup"
import { AuthApi } from "@passes/api-client/apis"
import { USER_MIN_AGE } from "@passes/shared-constants"
import { differenceInYears, format } from "date-fns"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import jwtDecode from "jwt-decode"
import EnterIcon from "public/icons/enter-icon.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { SelectInput } from "src/components/atoms/input/SelectInput"
import { DateSelector } from "src/components/atoms/signup/DateSelector"
import { SignupFooter } from "src/components/atoms/signup/SignupFooter"
import { Text } from "src/components/atoms/Text"
import { FULL_NAME_REGEX } from "src/config/name"
import { COUNTRIES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"
import { checkUsername } from "src/helpers/username"
import { displayNameSchema } from "src/helpers/validation/displayName"
import { usernameSchema } from "src/helpers/validation/username"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { JWTUserClaims, useUser } from "src/hooks/useUser"
import { StandAlonePage } from "src/layout/StandAlonePage"
import { WithLoginPageLayout } from "src/layout/WithLoginPageLayout"

const BIRTHDAY_DATE_FORMAT = "yyyy-MM-dd"

export type SignupInfoPageSchema = {
  legalFullName: string
  username: string
  countryCode: string
  birthday: string
  displayName: string
}

const signupInfoPageSchema: SchemaOf<SignupInfoPageSchema> = object({
  legalFullName: string()
    .required("Enter your full name")
    .matches(FULL_NAME_REGEX, "Please enter a valid full name"),
  birthday: string()
    .required("Enter your birthday")
    .test(
      "birthday-age",
      `You must be at least ${USER_MIN_AGE} to sign up`,
      (value) =>
        value !== undefined &&
        differenceInYears(new Date(), new Date(value)) >= USER_MIN_AGE
    ),
  countryCode: string().required("Enter your country"),
  ...usernameSchema,
  ...displayNameSchema
})

const SignupInfoPage: FC = () => {
  const { mutateManual } = useUser()
  const { auth } = useAuthEvent(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue
  } = useForm<SignupInfoPageSchema>({
    resolver: yupResolver(signupInfoPageSchema)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("birthday", format(date, BIRTHDAY_DATE_FORMAT))
    }
  }

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
          // If we mutate immediately there might not be a user entry in the db reader
          // so instead reader so we instead manually construct mutate the user.
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

  const onSubmit = (values: SignupInfoPageSchema) => {
    setIsSubmitting(true)
    createNewUser(
      values.legalFullName,
      values.username,
      iso3311a2.getCode(values.countryCode),
      values.birthday,
      values.displayName
    )
  }

  return (
    <StandAlonePage className="w-[100vw] max-w-[750px]">
      <Text className="mb-4 w-[360px] text-center font-[500]" fontSize={36}>
        Let&apos;s get to know each other
      </Text>
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Full name</Text>
          <Input
            autoComplete="name"
            className="w-[360px]"
            errors={errors}
            name="legalFullName"
            placeholder="Enter your full name"
            register={register}
            transparent={false}
            type="text"
          />
        </div>

        <div className="flex flex-col items-start">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Username</Text>
          <Input
            className="w-[360px]"
            errors={errors}
            name="username"
            placeholder="Enter your username"
            register={register}
            transparent={false}
            type="text"
          />
        </div>

        <div className="flex flex-col items-start">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
            Display Name
          </Text>
          <Input
            className="w-[360px]"
            errors={errors}
            name="displayName"
            placeholder="Enter your display name"
            register={register}
            transparent={false}
            type="text"
          />
        </div>
        <div className="flex flex-col items-start">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Birthday</Text>
          <DateSelector errors={errors.birthday} onDateChange={onDateChange} />
        </div>
        <div className="flex flex-col items-start">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Country</Text>
          <SelectInput
            autoComplete="country"
            className="w-[360px]"
            control={control}
            errors={errors}
            name="countryCode"
            placeholder="Enter your country"
            selectOptions={COUNTRIES}
            showOnTop
            transparent={false}
          />
        </div>

        <Button
          disabled={isSubmitting}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <Text className="font-medium" fontSize={16}>
            Register account
          </Text>
          <EnterIcon />
        </Button>
      </form>
      <SignupFooter disabled={isSubmitting} />
    </StandAlonePage>
  )
}

export default WithLoginPageLayout(SignupInfoPage, {
  refreshUnverifiedToken: true
})
