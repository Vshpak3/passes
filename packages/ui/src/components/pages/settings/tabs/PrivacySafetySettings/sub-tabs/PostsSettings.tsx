import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Tab } from "src/components/pages/settings/Tab"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"

const defaultValues = {
  enableComments: false
}

type PostSettingsForm = typeof defaultValues

const PostsSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty }
  } = useForm<PostSettingsForm>({
    defaultValues
  })

  const onSubmit = async (values: PostSettingsForm) => {
    await updateCreatorSettings(
      { allowCommentsOnPosts: values.enableComments },
      `comments has been ${
        values.enableComments ? "allowed" : "disallowed"
      } for post`
    )
    reset(undefined, { keepValues: true })
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    reset({
      enableComments: !!creatorSettings?.allowCommentsOnPosts
    })
  }, [creatorSettings, isLoading, reset])

  return (
    <Tab title="Posts">
      <form className="mt-[22px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-[32px] space-y-[32px]">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Enable Comments</span>
            <Checkbox name="enableComments" register={register} type="toggle" />
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

export default memo(PostsSettings) // eslint-disable-line import/no-default-export
