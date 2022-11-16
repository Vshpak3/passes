import { yupResolver } from "@hookform/resolvers/yup"
import { AdminApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/admin/AdminTab"
import { errorMessage } from "src/helpers/error"
import { dirtyValues } from "src/helpers/form"
import { useUser } from "src/hooks/useUser"

interface AdminFormSchema {
  secret: string
  userId?: string
  username?: string
}

const adminFormSchema = object().shape(
  {
    secret: string().required("The secret is required"),
    userId: string().when("username", {
      is: "",
      then: string().required("Please enter a username or userId"),
      otherwise: string()
    }),
    username: string().when("userId", {
      is: "",
      then: string().required("Please enter a username or userId"),
      otherwise: string()
    })
  },
  [["userId", "username"]]
)

export const ImpersonateUser = () => {
  const { setAccessToken, mutate: refreshUser } = useUser()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitSuccessful }
  } = useForm<AdminFormSchema>({
    resolver: yupResolver(adminFormSchema)
  })

  const impersonateUser = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      const res = await api.impersonateUser({
        impersonateUserRequestDto: { ...values }
      })

      setAccessToken(res.accessToken)
      refreshUser()

      router.push("/home")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const makeAdult = async (values: AdminFormSchema) => {
    try {
      const api = new AdminApi()
      await api.flagAsAdult({
        adminDto: { ...values }
      })
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const onSubmit = (event: string, values: AdminFormSchema) => {
    const changes = dirtyValues(dirtyFields, values)
    switch (event) {
      case "impersonateUser":
        impersonateUser(changes)
        break
      case "makeAdult":
        makeAdult(changes)
        break
    }
  }
  return (
    <Tab title="Impersonate a user">
      <div className="flex h-full flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
        <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
          <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
            <Text
              className="mb-4 w-[360px] text-center font-[500] text-white"
              fontSize={20}
            >
              Impersonate a user
            </Text>
            <form
              className="flex flex-col gap-y-5"
              onSubmit={handleSubmit((d) => onSubmit("impersonateUser", d))}
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                  Admin Secret
                </Text>
                <Input
                  className="w-[360px] border-[#34343A60] bg-black text-white"
                  errors={errors}
                  name="secret"
                  placeholder="Enter the admin secret"
                  register={register}
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                  User ID
                </Text>
                <Input
                  className="w-[360px] border-[#34343A60] bg-black text-white"
                  errors={errors}
                  name="userId"
                  placeholder="Enter user id or username below"
                  register={register}
                  type="text"
                />
              </div>
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
                  Username
                </Text>
                <Input
                  className="w-[360px] border-[#34343A60] bg-black text-white"
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
    </Tab>
  )
}
