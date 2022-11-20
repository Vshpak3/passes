import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/admin/AdminTab"
import { dirtyValues } from "src/helpers/form"

export interface AdminFormSchema {
  secret: string
  userId?: string
  username?: string
}
export const adminFormBase = {
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
}

const adminFormSchema = object().shape(adminFormBase)

interface AdminUserPageProps {
  action: (values: AdminFormSchema) => void
  label: string
  title: string
  description?: string
}

export const AdminUserPage = ({
  action,
  label,
  title,
  description
}: AdminUserPageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitSuccessful }
  } = useForm<AdminFormSchema>({
    resolver: yupResolver(adminFormSchema)
  })

  const onSubmit = (values: AdminFormSchema) => {
    const changes = dirtyValues(dirtyFields, values)
    action(changes)
  }
  return (
    <Tab
      isSubmitting={isSubmitSuccessful}
      label={label}
      onSubmit={handleSubmit(onSubmit)}
      title={title}
    >
      {description}
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
