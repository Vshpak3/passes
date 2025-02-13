import { AgencyMemberDto } from "@passes/api-client"
import { AdminApi } from "@passes/api-client/apis"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { AdminTab } from "src/components/pages/admin/AdminTab"
import { errorMessage } from "src/helpers/error"

export const ViewCovetedMembers = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<{ secret: string }>()
  const [members, setMembers] = useState<AgencyMemberDto[]>([])

  const getCovetedMembers = async (values: { secret: string }) => {
    try {
      const api = new AdminApi()
      setMembers(
        (
          await api.getCovetedMembers({
            adminDto: { ...values, username: "username" }
          })
        ).data
      )
      toast.success("Coveted members retrieved")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }
  return (
    <div className="flex w-full flex-col">
      <AdminTab
        disableButton={!isDirty || isSubmitting}
        label="View"
        onSubmit={handleSubmit(getCovetedMembers)}
        title="View Coveted Members"
      >
        <div className="flex w-full flex-col">
          <Text className="mb-1 text-[#b3bee7] opacity-[0.75]">
            Admin Secret
          </Text>
          <Input
            className="w-full"
            errors={errors}
            name="secret"
            placeholder="Enter the admin secret"
            register={register}
            type="text"
          />
        </div>
      </AdminTab>
      <div className="flex flex-col items-center">
        {members.map((member) => {
          return (
            <div
              className="flex flex-row items-center justify-between"
              key={member.userId}
            >
              <ProfileWidget linked={false} user={member} />
              <div>rate: {member.rate}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
