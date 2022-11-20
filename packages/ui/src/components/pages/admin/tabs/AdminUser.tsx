import { yupResolver } from "@hookform/resolvers/yup"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { object } from "yup"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/admin/AdminTab"
import { dirtyValues } from "src/helpers/form"
import { adminFormBase, AdminFormSchema } from ".."

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
  const adminFormSchema = useMemo(
    () => object().shape(adminFormBase, [["userId", "username"]]),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting }
  } = useForm<AdminFormSchema>({
    resolver: yupResolver(adminFormSchema)
  })

  const onSubmit = (values: AdminFormSchema) => {
    const changes = dirtyValues(dirtyFields, values)
    action(changes)
  }
  return (
    <Tab
      isSubmitting={isSubmitting}
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
