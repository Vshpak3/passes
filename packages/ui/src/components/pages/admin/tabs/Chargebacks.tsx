import { ChargebackDto } from "@passes/api-client"
import { AdminApi } from "@passes/api-client/apis"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/admin/AdminTab"
import { errorMessage } from "src/helpers/error"

export const Chargebacks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
    // watch
  } = useForm<{ secret: string }>()
  const [chargebacks, setChargebacks] = useState<ChargebackDto[]>([])
  // const secret = watch("secret")
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
    <div className="flex w-full flex-col">
      <Tab
        isSubmitting={isSubmitting}
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
        <div className="flex flex-col items-center">
          {chargebacks.map((chargeback) => {
            chargeback.fullContent = JSON.parse(
              chargeback.fullContent as unknown as string
            )
            return (
              <div
                className="passes-break flex flex-row items-center justify-between whitespace-pre-wrap"
                key={chargeback.userId}
              >
                <div>{JSON.stringify(chargeback, null, 4)}</div>
              </div>
            )
          })}
        </div>
      </Tab>
    </div>
  )
}
