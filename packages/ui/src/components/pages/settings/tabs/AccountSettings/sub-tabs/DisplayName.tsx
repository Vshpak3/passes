import { yupResolver } from "@hookform/resolvers/yup"
import { FC, memo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { displayNameSchema } from "src/helpers/validation/displayName"
import { useUser } from "src/hooks/useUser"

interface DisplayNameFormProps {
  displayName: string
}

const displayNameFormSchema: SchemaOf<DisplayNameFormProps> =
  object(displayNameSchema)

const DisplayName: FC = () => {
  const { user, loading, updateDisplayName } = useUser()

  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<DisplayNameFormProps>({
    resolver: yupResolver(displayNameFormSchema)
  })

  const displayName = watch("displayName")

  useEffect(() => {
    if (user?.displayName) {
      setValue("displayName", user?.displayName)
    }
  }, [setValue, user])

  const onSaveDisplayName = async ({ displayName }: DisplayNameFormProps) => {
    try {
      await updateDisplayName(displayName)
      toast.success("Your display name has been updated successfully")
    } catch (error) {
      const message = await errorMessage(error, true)
      setError("displayName", { type: "value", message }, { shouldFocus: true })
    }
  }

  return (
    <Tab title="Change Display Name">
      <form className="mt-6" onSubmit={handleSubmit(onSaveDisplayName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Display Name</span>
          <Input
            className="mt-1.5 border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-white/90 focus:border-passes-secondary-color focus:ring-0"
            errors={errors}
            name="displayName"
            register={register}
            type="text"
          />
        </label>
        <Button
          className="mt-6 w-auto !px-[52px]"
          disabled={
            loading ||
            displayName?.trim().length === 0 ||
            displayName === user?.displayName ||
            isSubmitting
          }
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(DisplayName) // eslint-disable-line import/no-default-export
