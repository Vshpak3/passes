import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
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
    <Tab title="Posts" withBack>
      {!isLoading && (
        <form
          className="mt-[22px]"
          onSubmit={handleSubmit(savePostsSettingsHandler)}
        >
          <div className="mt-[32px] space-y-[32px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">Enable Comments</span>
              <Checkbox
                name="enableComments"
                register={register}
                type="toggle"
              />
            </label>
          </div>

          <Button
            className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
            disabled={isLoading || flipped}
            disabledClass="opacity-[0.64]"
            type={ButtonTypeEnum.SUBMIT}
            variant="pink"
          >
            <span>Save</span>
          </Button>
        </form>
      )}
    </Tab>
  )
}

export default memo(PostsSettings) // eslint-disable-line import/no-default-export
