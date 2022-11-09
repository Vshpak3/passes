import { yupResolver } from "@hookform/resolvers/yup"
import { FC, memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Text } from "src/components/atoms/Text"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { getYupRequiredStringSchema } from "src/helpers/validation"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { useUser } from "src/hooks/useUser"

interface UsernameFormProps {
  username: string
}

const Username: FC = () => {
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
    <Tab title="Change Username" withBack>
      <form className="mt-6" onSubmit={handleSubmit(onSaveUserName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Username</span>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2">@</span>
            <Input
              className="mt-1.5 border-passes-gray-700/80 bg-transparent !py-4 !pl-[26px] !pr-3 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
              name="username"
              register={register}
              type="text"
            />
          </div>
        </label>
        {errors.username && (
          <Text className="mt-1 block text-[red]" fontSize={12}>
            {errors.username.message}
          </Text>
        )}

        <Button
          className="mt-6 w-auto !px-[52px]"
          disabled={
            loading ||
            username.trim().length === 0 ||
            username === user?.username ||
            disableForm
          }
          disabledClass="opacity-[0.64]"
          type={ButtonTypeEnum.SUBMIT}
          variant="pink"
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(Username) // eslint-disable-line import/no-default-export
