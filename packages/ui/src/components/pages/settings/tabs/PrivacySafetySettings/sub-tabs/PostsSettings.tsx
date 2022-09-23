import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { usePrivacySafetySettings } from "src/hooks"
import useSWR from "swr"

import Tab from "../../../Tab"

const defaultValues = {
  enableComments: false
}

const PostsSettings = () => {
  const { getCreatorSettings, updateCreatorSettings } =
    usePrivacySafetySettings()
  const { data: creatorSettings, mutate } = useSWR(
    "/creator-settings",
    getCreatorSettings
  )
  const { register, setValue, handleSubmit, watch } = useForm<
    typeof defaultValues
  >({
    defaultValues
  })

  const values = watch()

  const savePostsSettingsHandler = async (values: typeof defaultValues) => {
    await updateCreatorSettings({ allowCommentsOnPosts: values.enableComments })
    mutate()
  }

  useEffect(() => {
    if (creatorSettings) {
      setValue("enableComments", !!creatorSettings?.allowCommentsOnPosts)
    }
  }, [creatorSettings, setValue])

  return (
    <Tab withBack title="Posts">
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
          className="mt-[34px] w-auto !px-[52px]"
          tag="button"
          disabled={
            values.enableComments === !!creatorSettings?.allowCommentsOnPosts
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

export default PostsSettings
