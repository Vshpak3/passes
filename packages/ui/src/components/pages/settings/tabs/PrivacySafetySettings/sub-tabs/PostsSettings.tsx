import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import Tab from "src/components/pages/settings/Tab"
import { useCreatorSettings } from "src/hooks"

const defaultValues = {
  enableComments: false
}

const PostsSettings = () => {
  const { creatorSettings, isLoading, isUpdating, updateCreatorSettings } =
    useCreatorSettings()
  const {
    register,
    setValue,
    handleSubmit,
    formState: { isSubmitSuccessful }
  } = useForm<typeof defaultValues>({
    defaultValues
  })

  // const values = watch()

  const savePostsSettingsHandler = async (values: typeof defaultValues) => {
    await updateCreatorSettings(
      { allowCommentsOnPosts: values.enableComments },
      `comments has been ${
        values.enableComments ? "allowed" : "disallowed"
      } for post`
    )
  }

  useEffect(() => {
    if (creatorSettings) {
      setValue("enableComments", !!creatorSettings?.allowCommentsOnPosts)
    }
  }, [creatorSettings, setValue])

  return (
    <Tab withBack title="Posts">
      <ConditionRendering condition={!isLoading}>
        <form
          className="mt-[22px]"
          onSubmit={handleSubmit(savePostsSettingsHandler)}
        >
          <div className="mt-[32px] space-y-[32px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">Enable Comments</span>
              <FormInput
                name="enableComments"
                register={register}
                type="toggle"
              />
            </label>
          </div>

          <Button
            variant="pink"
            className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
            tag="button"
            disabled={isUpdating || isSubmitSuccessful}
            disabledClass="opacity-[0.5]"
            type={ButtonTypeEnum.SUBMIT}
          >
            <span>Save</span>
          </Button>
        </form>
      </ConditionRendering>
    </Tab>
  )
}

export default PostsSettings
