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

type PostSettingsForm = Required<
  Pick<CreatorSettingsDto, "allowCommentsOnPosts">
>

const PostsSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()

  const {
    register,
    handleSubmit,
    reset: _reset,
    formState: { isDirty }
  } = useForm<PostSettingsForm>()

  const reset = useCallback(
    (settings?: CreatorSettingsDto) => {
      _reset({ allowCommentsOnPosts: !!settings?.allowCommentsOnPosts })
    },
    [_reset]
  )

  const onSubmit = async (values: PostSettingsForm) => {
    await updateCreatorSettings(
      { allowCommentsOnPosts: values.allowCommentsOnPosts },
      `comments has been ${
        values.allowCommentsOnPosts ? "allowed" : "disallowed"
      } for post`
    )
    reset(values)
  }

  useEffect(() => {
    if (isLoading) {
      return
    }
    reset(creatorSettings)
  }, [creatorSettings, isLoading, reset])

  return (
    <Tab defaultSubTab={SubTabsEnum.PrivacySafetySettings} title="Posts">
      <form className="mt-[22px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-[32px] space-y-[32px]">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Enable Comments</span>
            <Checkbox
              name="allowCommentsOnPosts"
              register={register}
              type="toggle"
            />
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
