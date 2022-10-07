import { yupResolver } from "@hookform/resolvers/yup"
import { GetUserResponseDto, UserApi } from "@passes/api-client"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import Tab from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { getYupRequiredStringSchema } from "src/helpers/validation"
import { useUser } from "src/hooks"

interface DisplayNameProps {
  user: GetUserResponseDto
}

interface DisplayNameFormProps {
  displayName: string
}

const DisplayName: FC<DisplayNameProps> = ({ user }) => {
  const { loading, mutateManual } = useUser(false)

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

  const setDisplayName = async (displayName: string) => {
    const userApi = new UserApi()
    return await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const onSaveDisplayName = async ({ displayName }: DisplayNameFormProps) => {
    try {
      await setDisplayName(displayName)
      mutateManual({ displayName })
      toast.success("Your display name has been updated successfully")
    } catch (error) {
      const message = await errorMessage(error, true)
      setError("displayName", { type: "value", message }, { shouldFocus: true })
    }
  }

  return (
    <Tab withBack title="Change Display Name">
      <form className="mt-6" onSubmit={handleSubmit(onSaveDisplayName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Display Name</span>
          <FormInput
            name="displayName"
            type="text"
            className="mt-1.5 border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            register={register}
            errors={errors}
          />
        </label>
        <Button
          variant="pink"
          className="mt-6 w-auto !px-[52px]"
          tag="button"
          disabled={
            loading ||
            displayName.trim().length === 0 ||
            displayName === user?.displayName ||
            disableForm
          }
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default DisplayName
