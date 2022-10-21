import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { Tab } from "src/components/pages/settings/Tab"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"

const defaultValues = {
  // fullPrivateProfile: true,
  showLikeCount: true,
  showPostCount: true
}

const ProfileSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()

  const { register, handleSubmit, setValue } = useForm<typeof defaultValues>({
    defaultValues
  })

  const saveProfileSettingsHandler = async (values: typeof defaultValues) => {
    await updateCreatorSettings(values, "email notifications has been changed")
  }

  useEffect(() => {
    if (creatorSettings) {
      setValue("showLikeCount", !!creatorSettings.showLikeCount)
      setValue("showPostCount", !!creatorSettings.showPostCount)
    }
  }, [creatorSettings, setValue])

  return (
    <Tab
      withBack
      title="Profile"
      description="Manage what information you and your fans see and share on Twitter."
    >
      {!isLoading && (
        <form
          className="mt-[22px]"
          onSubmit={handleSubmit(saveProfileSettingsHandler)}
        >
          <div className="mt-[32px] space-y-[32px]">
            {/* Disable private profiles for now
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Fully Private Profile</span>
            <FormInput
              name="fullPrivateProfile"
              register={register}
              type="toggle"
            />
          </label> */}
            {/*<label className="flex cursor-pointer items-center justify-between">
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
        </label>*/}

            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">
                Show likes count on your profile
              </span>
              <FormInput
                name="showLikeCount"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">
                Show post count on your profile
              </span>
              <FormInput
                name="showPostCount"
                register={register}
                type="toggle"
              />
            </label>
          </div>

          <Button
            variant="pink"
            className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
            tag="button"
            disabled={isLoading}
            disabledClass="opacity-[0.5]"
            type={ButtonTypeEnum.SUBMIT}
          >
            <span>Save</span>
          </Button>
        </form>
      )}
    </Tab>
  )
}

export default ProfileSettings // eslint-disable-line import/no-default-export
