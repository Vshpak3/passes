import { yupResolver } from "@hookform/resolvers/yup"
import { AuthLocalApi, UpdatePasswordRequestDto } from "@passes/api-client"
import Link from "next/link"
import { memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { passwordFormSchema } from "src/pages/signup"
import { object, SchemaOf, string } from "yup"

interface ChangePasswordFormProps {
  oldPassword: string
  password: string
  confirmPassword: string
}

const changePasswordFormSchema: SchemaOf<ChangePasswordFormProps> = object({
  oldPassword: string().required("Please enter your current password"),
  ...passwordFormSchema
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
    formState: { errors, isSubmitting }
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
    confirmPassword,
    password
  }: ChangePasswordFormProps) => {
    try {
      if (password !== confirmPassword) {
        return toast.error("Passwords does not match")
      }
      await changePassword({ oldPassword, newPassword: password })
      toast.success("Your password has been changed successfully")
      reset(defaultValues)
    } catch (error) {
      errorMessage(error, true)
    }
  }

  return (
    <>
      <Tab
        withBack
        title="Change Password"
        description="Change your password at any time."
      />
      <form className="mt-6" onSubmit={handleSubmit(onChangePassword)}>
        <div className="border-b border-passes-dark-200 pb-6">
          <FormInput
            errors={errors}
            placeholder="Current Password"
            name="oldPassword"
            type="password"
            register={register}
            className="border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
          <Link
            href="/forgot-password"
            passHref
            className="ml-3 mt-1.5 inline-block text-xs font-light leading-3 text-passes-pink-100"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 border-b border-passes-dark-200 pb-6">
          <FormInput
            placeholder="New Password"
            name="password"
            type="password"
            register={register}
            className="border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            errors={errors}
          />
          <FormInput
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            className="mt-6 border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            errors={errors}
          />
        </div>

        <Button
          variant="pink"
          className="mt-6 w-auto !px-[52px]"
          tag="button"
          disabled={isSubmitting}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </>
  )
}

export default memo(ChangePassword) // eslint-disable-line import/no-default-export
