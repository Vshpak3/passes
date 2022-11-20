import { yupResolver } from "@hookform/resolvers/yup"
import { AdminApi } from "@passes/api-client/apis"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, string } from "yup"

import { Input } from "src/components/atoms/input/GeneralInput"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/admin/AdminTab"
import { errorMessage } from "src/helpers/error"
import { dirtyValues } from "src/helpers/form"
import { adminFormBase, AdminFormSchema } from ".."

interface UpdateCovetedMemberSchema extends AdminFormSchema {
  rate: string
}

export const UpdatedCovetedMember = () => {
  const adminFormSchema = useMemo(
    () =>
      object().shape(
        {
          ...adminFormBase,
          rate: string()
            .required("rate is required")
            .test(
              "min",
              "rate can't be less than 0",
              (value) => parseFloat(value || "") >= 0
            )
            .test(
              "max",
              "rate can't be more than 1",
              (value) => parseFloat(value || "") <= 1
            )
        },
        [["userId", "username"]]
      ),
    []
  )
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting }
  } = useForm<UpdateCovetedMemberSchema>({
    resolver: yupResolver(adminFormSchema)
  })

  const updateCovetedMember = async (values: UpdateCovetedMemberSchema) => {
    const changes = dirtyValues(dirtyFields, values)
    try {
      const api = new AdminApi()
      await api.updateCovetedMember({
        updateAgencyMemberDto: { ...changes, rate: parseFloat(changes.rate) }
      })
      toast.success("Updated coveted member")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }
  return (
    <Tab
      isSubmitting={isSubmitting}
      label="Update"
      onSubmit={handleSubmit(updateCovetedMember)}
      title="Update Coveted Member"
    >
      *Setting a rate to 0 removes them from the agency
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
      <div className="flex flex-col">
        <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">Rate</Text>
        <NumberInput
          className="w-full"
          errors={errors}
          name="rate"
          register={register}
          type="float"
        />
      </div>
    </Tab>
  )
}
