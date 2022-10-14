import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { Tab } from "src/components/pages/settings/Tab"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"

const defaultValues = {
  enableComments: false
}

const PostsSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()
  const { register, setValue, handleSubmit, watch } = useForm<
    typeof defaultValues
  >({
    defaultValues
  })
  const [flipped, setFlipped] = useState<boolean>(false)

  const savePostsSettingsHandler = async (values: typeof defaultValues) => {
    await updateCreatorSettings(
      { allowCommentsOnPosts: values.enableComments },
      `comments has been ${
        values.enableComments ? "allowed" : "disallowed"
      } for post`
    )
    setFlipped(true)
  }

  const values = watch("enableComments")
  useEffect(() => {
    setFlipped(false)
  }, [values])

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
            disabled={isLoading || flipped}
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

export default PostsSettings // eslint-disable-line import/no-default-export
