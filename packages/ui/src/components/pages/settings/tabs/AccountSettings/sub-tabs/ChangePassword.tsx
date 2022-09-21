import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { changePasswordSchema } from "src/helpers/validation"

import Tab from "../../../Tab"

interface IChangePasswordForm {
  currentPassword: string
  password: string
  confirmPassword: string
}

const defaultValues = { currentPassword: "", password: "", confirmPassword: "" }

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
  const values = watch()

  const onChangePassword = ({
    currentPassword,
    confirmPassword,
    password
  }: IChangePasswordForm) => {
    console.log("passwords", currentPassword, confirmPassword, password)
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
            name="currentPassword"
            type="password"
            register={register}
            className="border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
          <a
            href="#"
            className="ml-3 mt-1.5 inline-block text-xs font-light leading-3 text-passes-pink-100"
          >
            Forgot Password?
          </a>
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
