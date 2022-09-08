import { AuthApi } from "@passes/api-client/apis"
import jwtDecode from "jwt-decode"
import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput, Text, Wordmark } from "src/components/atoms"
import { wrapApi } from "src/helpers/wrapApi"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import { useUser } from "../../hooks"

const UserEmailPage = () => {
  const {
    loading,
    user,
    userClaims,
    setAccessToken,
    mutate: refreshUser
  } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onUserRegister = async (email) => {
    try {
      const setEmailRequestDto = {
        email
      }

      const api = wrapApi(AuthApi)
      const res = await api.setUserEmail({
        setEmailRequestDto
      })

      setAccessToken(res.accessToken)

      const decodedClaims = jwtDecode(res.accessToken)
      if (decodedClaims.isEmailVerified) {
        router.push("/signup/user-info")
      } else {
        alert("TODO: You need to verify your email")
      }

      refreshUser()
    } catch (err) {
      toast.error(err)
    }
  }

  const onSubmit = (data) => {
    onUserRegister(data.email)
  }

  if (loading || !user) {
    return null
  }

  if (user.email && userClaims.isEmailVerified) {
    if (userClaims.isVerified) {
      router.push("/")
    }

    router.push("/signup/user-info")
  }

  return (
    <AuthOnlyWrapper isPage allowUnverified allowEmailUnverified>
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
                  Email address
                </Text>
                <FormInput
                  register={register}
                  name="email"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter your email address"
                  type="text"
                  errors={errors}
                  options={{
                    required: true
                  }}
                />
                {errors.emailAddress && (
                  <Text fontSize={12} className="mt-1 text-[red]">
                    {errors.emailAddress.message}
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

export default UserEmailPage
