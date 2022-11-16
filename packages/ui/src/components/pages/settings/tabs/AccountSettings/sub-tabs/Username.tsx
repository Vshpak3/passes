import { yupResolver } from "@hookform/resolvers/yup"
import classNames from "classnames"
import { FC, memo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { usernameSchema } from "src/helpers/validation/username"
import { useUser } from "src/hooks/useUser"

interface UsernameFormProps {
  username: string
}

const usernameFormSchema: SchemaOf<UsernameFormProps> = object(usernameSchema)

const Username: FC = () => {
  const { user, loading, updateUsername } = useUser()

  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UsernameFormProps>({
    resolver: yupResolver(usernameFormSchema)
  })

  const username = watch("username")

  useEffect(() => {
    if (user?.username) {
      setValue("username", user?.username)
    }
  }, [setValue, user])

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
    <Tab title="Change Username">
      <form className="mt-6" onSubmit={handleSubmit(onSaveUserName)}>
        <label>
          <span className="font-medium tracking-[-0.13px] text-gray-300/60">
            Username
          </span>
          <div className="relative">
            <span
              className={classNames(
                "absolute top-1/2  right-3 -translate-y-1/2",
                errors.username && "-bottom-[7px]"
              )}
            >
              @
            </span>
            <Input
              className="mt-1.5 !py-4 !pl-[26px]"
              errors={errors}
              name="username"
              register={register}
              type="text"
            />
          </div>
        </label>
        <Button
          className="mt-6 w-auto !px-[52px]"
          disabled={
            loading ||
            username?.trim().length === 0 ||
            username === user?.username ||
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

export default memo(Username) // eslint-disable-line import/no-default-export
