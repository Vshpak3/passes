import { yupResolver } from "@hookform/resolvers/yup"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { changePasswordSchema } from "src/helpers/validation"
import { useAccountSettings } from "src/hooks"

interface IChangePasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const defaultValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IChangePasswordForm>({
    defaultValues,
    resolver: yupResolver(changePasswordSchema)
  })
  const [isValidate, setIsValidate] = useState(false)
  const { changePassword } = useAccountSettings()
  const values = watch()

  const onChangePassword = async ({
    oldPassword,
    confirmPassword,
    newPassword
  }: IChangePasswordForm) => {
    try {
      if (newPassword !== confirmPassword) {
        return
      }
      await changePassword({ oldPassword, newPassword })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    changePasswordSchema
      .validate(values)
      .then(() => {
        return setIsValidate(true)
      })
      .catch(() => {
        setIsValidate(false)
      })
  }, [values])

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
          <Link href="/forgot-password" passHref>
            <a className="ml-3 mt-1.5 inline-block text-xs font-light leading-3 text-passes-pink-100">
              Forgot Password?
            </a>
          </Link>
        </div>

        <div className="mt-6 border-b border-passes-dark-200 pb-6">
          <FormInput
            placeholder="New Password"
            name="newPassword"
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
          disabled={!isValidate}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </>
  )
}

export default ChangePassword
