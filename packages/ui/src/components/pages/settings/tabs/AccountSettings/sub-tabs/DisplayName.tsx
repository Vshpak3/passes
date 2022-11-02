import { yupResolver } from "@hookform/resolvers/yup"
import { FC, memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { getYupRequiredStringSchema } from "src/helpers/validation"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { useUser } from "src/hooks/useUser"

interface DisplayNameFormProps {
  displayName: string
}

const DisplayName: FC = () => {
  const { user, loading, updateDisplayName } = useUser()

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<DisplayNameFormProps>({
    defaultValues: { displayName: user?.displayName || "" },
    resolver: yupResolver(
      getYupRequiredStringSchema({
        name: "displayName",
        errorMessage: "please enter your display name"
      })
    )
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const displayName = watch("displayName")

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
    <Tab title="Change Display Name" withBack>
      <form className="mt-6" onSubmit={handleSubmit(onSaveDisplayName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Display Name</span>
          <Input
            className="mt-1.5 border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
            displayName.trim().length === 0 ||
            displayName === user?.displayName ||
            disableForm
          }
          disabledClass="opacity-[0.5]"
          tag="button"
          type={ButtonTypeEnum.SUBMIT}
          variant="pink"
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(DisplayName) // eslint-disable-line import/no-default-export
