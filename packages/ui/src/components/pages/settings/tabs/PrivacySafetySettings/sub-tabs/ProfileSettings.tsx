import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { usePrivacySafetySettings } from "src/hooks"
import useSWR from "swr"

import Tab from "../../../Tab"

const defaultValues = {
  fullPrivateProfile: true,
  showFollowerCount: true,
  showMediaCount: true
}

const ProfileSettings = () => {
  const { privateProfileHandler, getCreatorSettings, updateCreatorSettings } =
    usePrivacySafetySettings()
  const { data: creatorSettings, mutate } = useSWR(
    "/creator-settings",
    getCreatorSettings
  )
  const { register, watch, handleSubmit, setValue } = useForm<
    typeof defaultValues
  >({
    defaultValues
  })
  const values = watch()
  const [isDisableBtn, setIsDisabledBtn] = useState(false)

  const saveProfileSettingsHandler = async (values: typeof defaultValues) => {
    const { fullPrivateProfile, ...countSettings } = values
    await privateProfileHandler(fullPrivateProfile)
    await updateCreatorSettings(countSettings)
    mutate()
  }

  useEffect(() => {
    if (creatorSettings) {
      const { showFollowerCount, showMediaCount } = creatorSettings

      if (
        values.fullPrivateProfile === true &&
        values.showFollowerCount === !!showFollowerCount &&
        values.showMediaCount === !!showMediaCount
      ) {
        return setIsDisabledBtn(true)
      }
      setIsDisabledBtn(false)
    }
  }, [creatorSettings, values])

  useEffect(() => {
    if (creatorSettings) {
      setValue("showFollowerCount", !!creatorSettings.showFollowerCount)
      setValue("showMediaCount", !!creatorSettings.showMediaCount)
    }
  }, [creatorSettings, setValue])

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
            <FormInput
              name="showFollowerCount"
              register={register}
              type="toggle"
            />
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
          disabled={isDisableBtn}
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
