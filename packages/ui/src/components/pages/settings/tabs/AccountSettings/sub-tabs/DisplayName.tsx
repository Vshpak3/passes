import React from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { useAccountSettings, useUser } from "src/hooks"

interface IDisplayNameForm {
  displayName: string
}

const DisplayName = () => {
  const { user, mutate, loading } = useUser()
  const { register, watch, handleSubmit } = useForm<IDisplayNameForm>({
    defaultValues: { displayName: user?.displayName || "" }
  })
  const { setDisplayName } = useAccountSettings()

  const displayName = watch("displayName")

  const onSaveDisplayName = async ({ displayName }: IDisplayNameForm) => {
    await setDisplayName(displayName)
    mutate()
  }

  return (
    <Tab withBack title="Change Display Name">
      <form className="mt-6" onSubmit={handleSubmit(onSaveDisplayName)}>
        <label className="font-medium tracking-[-0.13px] text-[rgba(179,_190,_231,_0.6)]">
          <span>Display Name</span>
          <FormInput
            name="displayName"
            type="text"
            register={register}
            className="mt-1.5 border-passes-gray-700/80 bg-transparent !px-3 !py-4 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
        </label>
        <Button
          variant="pink"
          className="mt-6 w-auto !px-[52px]"
          tag="button"
          disabled={
            displayName.trim().length === 0 ||
            user?.displayName === displayName ||
            loading
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
