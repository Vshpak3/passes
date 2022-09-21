import React from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"

import Tab from "../../../Tab"

const defaultValues = {
  fullPrivateProfile: true,
  showFansCount: true,
  showMediaCount: true
}

const ProfileSettings = () => {
  const { register, handleSubmit } = useForm<typeof defaultValues>({
    defaultValues
  })

  const saveProfileSettingsHandler = (values: typeof defaultValues) => {
    console.log("saving settings", values)
  }

  return (
    <Tab
      withBack
      title="Profile"
      description="Manage what information you and your fans see and share on Twitter."
    >
      <form
        className="mt-[22px]"
        onSubmit={handleSubmit(saveProfileSettingsHandler)}
      >
        <div className="mt-[32px] space-y-[32px]">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Fully Private Profile</span>
            <FormInput
              name="fullPrivateProfile"
              register={register}
              type="toggle"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show fans count on your profile</span>
            <FormInput name="showFansCount" register={register} type="toggle" />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show media count on your profile</span>
            <FormInput
              name="showMediaCount"
              register={register}
              type="toggle"
            />
          </label>
        </div>

        <Button
          variant="pink"
          className="mt-[34px] w-auto !px-[52px]"
          tag="button"
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default ProfileSettings
