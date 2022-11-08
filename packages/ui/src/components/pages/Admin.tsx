import { AdminApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Wordmark } from "src/components/atoms/Wordmark"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"

const ADMIN_EMAIL = "@passes.com"

const AdminPage = () => {
  const { loading, user, setAccessToken, mutate: refreshUser } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm()

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user || !user.email.endsWith(ADMIN_EMAIL)) {
      router.push("/home")
    }
  }, [loading, router, user])

  const impersonateUser = async (
    secret: string,
    userId?: string,
    username?: string
  ) => {
    try {
      const api = new AdminApi()
      const res = await api.impersonateUser({
        impersonateUserRequestDto: { userId, username, secret }
      })

      setAccessToken(res.accessToken)
      refreshUser()

      router.push("/home")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const makeAdult = async (
    secret: string,
    userId?: string,
    username?: string
  ) => {
    try {
      const api = new AdminApi()
      await api.flagAsAdult({
        adminDto: { userId, username, secret }
      })
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const onSubmit = (
    event: string,
    data: Record<string, string | undefined>
  ) => {
    if (!data.secret) {
      toast.error("Secret is required")
      return
    }

    if (!data.userId && !data.username) {
      toast.error("User ID or Username is required")
      return
    }

    if (data.userId && data.username) {
      toast.error("Cannot set both User ID and Username")
      return
    }

    switch (event) {
      case "impersonateUser":
        impersonateUser(data.secret, data.userId, data.username)
        break
      case "makeAdult":
        makeAdult(data.secret, data.userId, data.username)
        break
    }
  }

  return (
    <div className="flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        className="z-10 self-center lg:self-start"
        height={28}
        whiteOnly
        width={122}
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#12070E] bg-[url('/img/signup-background.png')] bg-cover opacity-[50] backdrop-blur-[164px]" />
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          <Text
            className="mb-4 w-[360px] text-center font-semibold text-white"
            fontSize={20}
          >
            Impersonate a user
          </Text>
          <form
            className="flex flex-col gap-y-5"
            onSubmit={handleSubmit((d) => onSubmit("impersonateUser", d))}
          >
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Admin Secret
              </Text>
              <Input
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="secret"
                placeholder="Enter the admin secret"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">User ID</Text>
              <Input
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="userId"
                placeholder="Enter user id or username below"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col">
              <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                Username
              </Text>
              <Input
                className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="username"
                placeholder="Enter username or user id above"
                register={register}
                type="text"
              />
            </div>

            <button
              className="z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:via-purple-900 dark:to-plumDark-plum9"
              disabled={isSubmitSuccessful}
              type="submit"
            >
              <Text className="font-medium" fontSize={16}>
                Impersonate
              </Text>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminPage // eslint-disable-line import/no-default-export
