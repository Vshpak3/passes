import { UserApi } from "@passes/api-client/apis"
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { wrapApi } from "src/helpers/wrapApi"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import { useUser } from "../../hooks"

export async function getServerSideProps({ query }) {
  if (!query.hash) {
    return {
      notFound: true
    }
  }

  return {
    props: {}
  }
}

const UserInfoPage = () => {
  const { loading, user, refreshAccessToken } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onUserRegister = async (name, username, countryCode, birthday) => {
    try {
      const userSetInitialInfoRequestDto = {
        legalFullName: name,
        username: username,
        countryCode: countryCode,
        birthday: birthday
      }

      const api = wrapApi(UserApi)
      const res = await api.userSetInitialInfo({
        userSetInitialInfoRequestDto
      })

      if (!res.id) {
        alert("ERROR: Unexpected payload")
      }

      await refreshAccessToken()

      router.push("/home")
    } catch (err) {
      toast.error(err)
    }
  }

  const onSubmit = (data) => {
    onUserRegister(
      data.name,
      data.username,
      iso3311a2.getCode(data.countryCode),
      data.birthday
    )
  }

  const timeConverter = (unixTimestamp) => {
    const a = new Date(unixTimestamp)
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ]
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()

    return `${year}-${month}-${date}`
  }

  const isOver18 = () => {
    let eighteenYearsAgo = new Date()
    eighteenYearsAgo = eighteenYearsAgo.setFullYear(
      eighteenYearsAgo.getFullYear() - 18
    )

    return timeConverter(eighteenYearsAgo)
  }

  if (loading || !user) {
    return null
  }

  if (user.isVerified) {
    router.push("/home")
    return null
  }

  return (
    <AuthOnlyWrapper isPage allowUnverified>
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
                  name="displayName"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter your name"
                  type="text"
                  errors={errors}
                  options={{
                    required: true
                  }}
                />
                {errors.displayName && (
                  <Text fontSize={12} className="mt-1 text-[red]">
                    {errors.displayName.message}
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
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => (e.target.type = "text")}
                  max={isOver18()}
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
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Country
                </Text>
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
    </AuthOnlyWrapper>
  )
}

export default UserInfoPage
