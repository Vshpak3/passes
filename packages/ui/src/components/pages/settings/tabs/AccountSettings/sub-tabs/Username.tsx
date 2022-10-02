import React from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput, Text } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { useAccountSettings, useUser } from "src/hooks"

interface IUserForm {
  username: string
}

const Username = () => {
  const { user, mutate, loading } = useUser()
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<IUserForm>({
    defaultValues: { username: user?.username || "" }
  })
  const { setUsername } = useAccountSettings()

  const username = watch("username")

  const onSaveUserName = async ({ username }: IUserForm) => {
    try {
      await setUsername(username)
      mutate()
    } catch (err) {
      let errorMessage = "Something went wrong"
      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(
        "username",
        { type: "custom", message: errorMessage },
        { shouldFocus: true }
      )
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
              errors={errors}
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
            username.length === 0 || username === user?.username || loading
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

export default Username
