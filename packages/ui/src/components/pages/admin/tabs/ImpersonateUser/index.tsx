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
    <Tab
      isSubmitting={isSubmitSuccessful}
      label="Impersonate"
      onSubmit={handleSubmit((d) => onSubmit("impersonateUser", d))}
      title="Impersonate a user"
    >
      <div className="flex w-full flex-col">
        <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Admin Secret</Text>
        <Input
          className="w-full"
          errors={errors}
          name="secret"
          placeholder="Enter the admin secret"
          register={register}
          type="text"
        />
      </div>
      <div className="flex flex-col">
        <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">User ID</Text>
        <Input
          className="w-full"
          errors={errors}
          name="userId"
          placeholder="Enter user id or username below"
          register={register}
          type="text"
        />
      </div>
      <div className="flex flex-col">
        <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Username</Text>
        <Input
          className="w-full"
          errors={errors}
          name="username"
          placeholder="Enter username or user id above"
          register={register}
          type="text"
        />
      </div>
    </Tab>
  )
}
