import React from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"

import Tab from "../../../Tab"

const defaultValues = {
  enableComments: true
}

const PostsSettings = () => {
  const { register, handleSubmit } = useForm<typeof defaultValues>({
    defaultValues
  })

  const savePostsSettingsHandler = (values: typeof defaultValues) => {
    console.log("saving settings", values)
  }
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
