import { yupResolver } from "@hookform/resolvers/yup"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { Text } from "src/components/atoms/Text"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { getYupRequiredStringSchema } from "src/helpers/validation"
import { useUser } from "src/hooks/useUser"

interface UsernameFormProps {
  username: string
}

export const Username: FC = () => {
  const { user, loading, updateUsername } = useUser()

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<UsernameFormProps>({
    defaultValues: { username: user?.username || "" },
    resolver: yupResolver(getYupRequiredStringSchema({ name: "username" }))
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const username = watch("username")

  const onSaveUserName = async ({ username }: UsernameFormProps) => {
    try {
      await updateUsername(username)
      toast.success("Username has been changed successfully.")
    } catch (error) {
      const message = await errorMessage(error, true)
      setError("username", { type: "value", message }, { shouldFocus: true })
    }
  }

  return (
    <Tab withBack title="Change Username">
      <form className="mt-6" onSubmit={handleSubmit(onSaveUserName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Username</span>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2">@</span>
            <FormInput
              name="username"
              type="text"
              register={register}
              className="mt-1.5 border-passes-gray-700/80 bg-transparent !py-4 !pl-[26px] !pr-3 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
        </label>
        {errors.username && (
          <Text fontSize={12} className="mt-1 block text-[red]">
            {errors.username.message}
          </Text>
        )}

        <Button
          variant="pink"
          className="mt-6 w-auto !px-[52px]"
          tag="button"
          disabled={
            loading ||
            username.trim().length === 0 ||
            username === user?.username ||
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

export default Username // eslint-disable-line import/no-default-export
