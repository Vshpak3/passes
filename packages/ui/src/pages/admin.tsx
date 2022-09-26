import { AdminApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"

import { useUser } from "../hooks"

const ADMIN_EMAIL = "@passes.com"

const AdminPage = () => {
  const { loading, user, setAccessToken, mutate: refreshUser } = useUser()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
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
    } catch (err: unknown) {
      alert(err)
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
    } catch (err: unknown) {
      alert(err)
    }
  }

  const onSubmit = (
    event: string,
    data: Record<string, string | undefined>
  ) => {
    if (!data.secret) {
      alert("Secret is required")
      return
    }

    if (!data.userId && !data.username) {
      alert("User ID or Username is required")
      return
    }

    if (data.userId && data.username) {
      alert("Cannot set both User ID and Username")
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
    // No need to use AuthOnlyWrapper since we check
    <>
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
              fontSize={20}
              className="mb-4 w-[360px] text-center font-semibold text-white"
            >
              Impersonate a user
            </Text>
            <form
              onSubmit={handleSubmit((d) => onSubmit("impersonateUser", d))}
              className="flex flex-col gap-y-5"
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Admin Secret
                </Text>
                <FormInput
                  register={register}
                  name="secret"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter the admin secret"
                  type="text"
                  errors={errors}
                  options={{
                    required: true
                  }}
                />
              </div>
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  User ID
                </Text>
                <FormInput
                  register={register}
                  name="userId"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter user id or username below"
                  type="text"
                  errors={errors}
                  options={{
                    required: false
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
                  placeholder="Enter username or user id above"
                  type="text"
                  errors={errors}
                  options={{
                    required: false
                  }}
                />
              </div>

              <button
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-passes-blue-100 to-passes-purple-100 text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                type="submit"
              >
                <Text fontSize={16} className="font-medium">
                  Impersonate
                </Text>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPage
