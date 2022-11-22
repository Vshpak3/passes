import { ChargebackDto } from "@passes/api-client"
import { AdminApi } from "@passes/api-client/apis"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Chargeback } from "src/components/organisms/admin/Chargeback"
import { AdminTab } from "src/components/pages/admin/AdminTab"
import { errorMessage } from "src/helpers/error"

export const Chargebacks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch
  } = useForm<{ secret: string }>()
  const [chargebacks, setChargebacks] = useState<ChargebackDto[]>([])
  const secret = watch("secret")
  const getCovetedMembers = async (values: { secret: string }) => {
    try {
      const api = new AdminApi()
      setChargebacks(
        (
          await api.getUnprocessChargebacks({
            adminDto: { ...values, username: "username" }
          })
        ).data
      )
      toast.success("Chargebacks retrieved")
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <AdminTab
        disableButton={!isDirty || isSubmitting}
        label="View"
        onSubmit={handleSubmit(getCovetedMembers)}
        title="Manage Unprocessed Chargebacks"
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
        {chargebacks.map((chargeback) => {
          chargeback.fullContent = JSON.parse(
            chargeback.fullContent as unknown as string
          )
          return (
            <Chargeback
              chargeback={chargeback}
              key={chargeback.payinId}
              secret={secret}
            />
          )
        })}
      </div>
    </div>
  )
}
