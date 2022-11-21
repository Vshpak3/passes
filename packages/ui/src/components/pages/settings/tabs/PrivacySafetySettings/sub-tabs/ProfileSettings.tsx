import { memo, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import {
  CreatorSettingsDto,
  useCreatorSettings
} from "src/hooks/settings/useCreatorSettings"

type ProfileSettingsForm = Required<
  Pick<CreatorSettingsDto, "showLikeCount" | "showPostCount">
>

const ProfileSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()

  const {
    register,
    handleSubmit,
    reset: _reset,
    formState: { isDirty }
  } = useForm<ProfileSettingsForm>()

  const reset = useCallback(
    (settings?: CreatorSettingsDto) => {
      _reset({
        showLikeCount: !!settings?.showLikeCount,
        showPostCount: !!settings?.showPostCount
      })
    },
    [_reset]
  )

  const onSubmit = async (values: ProfileSettingsForm) => {
    await updateCreatorSettings(values, "Profile settings has been changed")
    reset(values)
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    reset(creatorSettings)
  }, [creatorSettings, isLoading, reset])

  return (
    <Tab
      defaultSubTab={SubTabsEnum.PrivacySafetySettings}
      description="Manage what information you and your fans see and share on Passes."
      title="Profile"
    >
      <form className="mt-[22px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-[32px] space-y-[32px]">
          {/* Disable private profiles for now
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Fully Private Profile</span>
            <Checkbox
              name="fullPrivateProfile"
              register={register}
              type="toggle"
            />
          </label> */}
          {/*<label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show fans count on your profile</span>
            <Checkbox
              name="showFollowerCount"
              register={register}
              type="toggle"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show media count on your profile</span>
            <Checkbox
              name="showMediaCount"
              register={register}
              type="toggle"
            />
        </label>*/}

          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show likes count on your profile</span>
            <Checkbox name="showLikeCount" register={register} type="toggle" />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Show post count on your profile</span>
            <Checkbox name="showPostCount" register={register} type="toggle" />
          </label>
        </div>

        <Button
          className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
          disabled={isLoading || !isDirty}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(ProfileSettings) // eslint-disable-line import/no-default-export
