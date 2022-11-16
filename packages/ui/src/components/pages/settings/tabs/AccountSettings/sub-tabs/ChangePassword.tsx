import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi, UpdatePasswordRequestDto } from "@passes/api-client"
import Link from "next/link"
import { memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, SchemaOf, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { PasswordInput } from "src/components/atoms/input/PasswordInput"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { passwordSchema } from "src/helpers/validation/password"

interface ChangePasswordFormProps {
  oldPassword: string
  password: string
  confirmPassword: string
}

const changePasswordFormSchema: SchemaOf<ChangePasswordFormProps> = object({
  oldPassword: string().required("Please enter your current password"),
  ...passwordSchema
})

const defaultValues = {
  oldPassword: "",
  password: "",
  confirmPassword: ""
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<ChangePasswordFormProps>({
    defaultValues,
    resolver: yupResolver(changePasswordFormSchema)
  })

  const changePassword = async (password: UpdatePasswordRequestDto) => {
    const authApi = new AuthLocalApi()
    await authApi.changePassword({
      updatePasswordRequestDto: password
    })
  }

  const onChangePassword = async ({
    oldPassword,
    password: newPassword
  }: ChangePasswordFormProps) => {
    try {
      await changePassword({ oldPassword, newPassword })
      toast.success("Your password has been changed successfully")
      reset(defaultValues)
    } catch (error) {
      errorMessage(error, true)
    }
  }

  return (
    <>
      <Tab
        description="Change your password at any time."
        title="Change Password"
      />
      <form className="mt-6" onSubmit={handleSubmit(onChangePassword)}>
        <div className="border-b border-passes-dark-200 pb-6">
          <PasswordInput
            autoComplete="current-password"
            className="!px-3 !py-4"
            errors={errors}
            name="oldPassword"
            placeholder="Current Password"
            register={register}
          />
          <Link
            className="ml-3 mt-1.5 inline-block text-xs font-light leading-3 text-passes-pink-100"
            href="/forgot-password"
            passHref
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 border-b border-passes-dark-200 pb-6">
          <PasswordInput
            autoComplete="new-password"
            className="!px-3 !py-4"
            errors={errors}
            name="password"
            placeholder="New Password"
            register={register}
          />
          <PasswordInput
            autoComplete="new-password"
            className="mt-6 !px-3 !py-4"
            errors={errors}
            name="confirmPassword"
            placeholder="Confirm Password"
            register={register}
          />
        </div>

        <Button
          className="mt-6 w-auto !px-[52px]"
          disabled={!isDirty || isSubmitting}
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </>
  )
}

export default memo(ChangePassword) // eslint-disable-line import/no-default-export
