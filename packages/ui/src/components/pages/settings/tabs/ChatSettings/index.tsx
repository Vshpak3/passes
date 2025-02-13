import { yupResolver } from "@hookform/resolvers/yup"
import { UpdateCreatorSettingsRequestDto } from "@passes/api-client"
import {
  MAX_TIP_MESSAGE_PRICE,
  MIN_TIP_MESSAGE_PRICE
} from "@passes/shared-constants"
import classNames from "classnames"
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { boolean, mixed, number, object, SchemaOf } from "yup"

import {
  Button,
  ButtonTypeEnum,
  ButtonVariant
} from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { ChannelMessage } from "src/components/molecules/messages/ChannelMessage"
import { Tab } from "src/components/pages/settings/Tab"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"
import { useWelcomeMessage } from "src/hooks/settings/useWelcomeMessage"
import { useUser } from "src/hooks/useUser"

interface ChatSettingsFormProps {
  isWithoutTip: boolean
  minimumTipAmount: string
  showWelcomeMessageInput: boolean
}

const chatSettingsSchema: SchemaOf<ChatSettingsFormProps> = object({
  isWithoutTip: boolean().required(),
  showWelcomeMessageInput: boolean().required(),
  minimumTipAmount: mixed().when("isWithoutTip", {
    is: false,
    then: number()
      .typeError("Please enter tip amount")
      .min(
        MIN_TIP_MESSAGE_PRICE,
        `Minimum tip amount is $${MIN_TIP_MESSAGE_PRICE}`
      )
      .max(
        MAX_TIP_MESSAGE_PRICE,
        `Maximum tip amount is $${MAX_TIP_MESSAGE_PRICE}`
      )
      .required("Please enter tip amount")
  })
})

const ChatSettings = () => {
  const { addTabToStackHandler } = useSettings() as SettingsContextProps
  const { user } = useUser()

  const {
    creatorSettings,
    isLoading: isCreatorSettingsLoading,
    updateCreatorSettings
  } = useCreatorSettings()

  const { welcomeMessage, isLoading: isWelcomeMessageLoading } =
    useWelcomeMessage()

  const isLoading = isCreatorSettingsLoading ?? isWelcomeMessageLoading

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
    watch
  } = useForm<ChatSettingsFormProps>({
    resolver: yupResolver(chatSettingsSchema)
  })

  const isWithoutTip = watch("isWithoutTip")
  const showWelcomeMessageInput = watch("showWelcomeMessageInput")

  const onSubmit = async (values: ChatSettingsFormProps) => {
    const data: UpdateCreatorSettingsRequestDto = {
      minimumTipAmount: !values.isWithoutTip ? +values.minimumTipAmount : null,
      welcomeMessage: !!values.showWelcomeMessageInput
    }
    await updateCreatorSettings(
      data,
      "Chat settings have been updated successfully"
    )
    reset(values)
  }

  useEffect(() => {
    if (isCreatorSettingsLoading) {
      return
    }
    reset({
      showWelcomeMessageInput: !!creatorSettings?.welcomeMessage,
      isWithoutTip: !creatorSettings?.minimumTipAmount,
      minimumTipAmount: `${creatorSettings?.minimumTipAmount}`
    })
  }, [creatorSettings, isCreatorSettingsLoading, reset])

  return (
    <AuthWrapper creatorOnly isPage>
      <Tab
        description="Setup auto welcome message, and manage messages without tips."
        isRootTab
        title="Chat Settings"
      />
      {!isLoading && (
        <form className="my-6" onSubmit={handleSubmit(onSubmit)}>
          <div
            className={classNames(
              "border-b border-passes-dark-200",
              isWithoutTip ? "pb-[22px]" : "pb-3"
            )}
          >
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">Accept messages without a tip</span>
              <Checkbox name="isWithoutTip" register={register} type="toggle" />
            </label>

            <div className={classNames("relative", isWithoutTip && "hidden")}>
              <span
                className={classNames(
                  "absolute top-1/2  right-3 -translate-y-1/2 text-[#6B728B]",
                  errors.minimumTipAmount && "-bottom-[7px]"
                )}
              >
                Minimum ${MIN_TIP_MESSAGE_PRICE}
              </span>
              <NumberInput
                className="mt-[22px] min-h-[50px] bg-transparent !py-4 !px-3 text-white/90"
                errors={errors}
                name="minimumTipAmount"
                placeholder="Enter Minimum Tip Amount"
                register={register}
                type="currency"
              />
            </div>
          </div>

          <div className="mt-[22px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">
                Send a welcome message to new fans
              </span>
              <Checkbox
                name="showWelcomeMessageInput"
                register={register}
                type="toggle"
              />
            </label>

            {showWelcomeMessageInput && (
              <div className="relative mt-[22px] rounded-md border border-passes-gray-700/80 !py-4 !px-3 focus:border-passes-secondary-color ">
                <div className="flex w-full flex-row justify-between">
                  <span className="text-gray-400">
                    {welcomeMessage
                      ? "Default Welcome Message:"
                      : "No welcome message selected."}
                  </span>
                  <Button
                    className="w-20 rounded-md py-1.5 text-center font-bold"
                    onClick={() =>
                      addTabToStackHandler(SubTabsEnum.WelcomeMessage)
                    }
                    variant={ButtonVariant.PINK_OUTLINE}
                  >
                    Edit
                  </Button>
                </div>

                {welcomeMessage && (
                  <ChannelMessage
                    inChannel={false}
                    message={{
                      text: welcomeMessage.text ?? "",
                      channelId: "",
                      contentProcessed: true,
                      contents: welcomeMessage.bareContents.map((content) => {
                        return { ...content, userId: user?.userId ?? "" }
                      }),
                      messageId: "",
                      paying: false,
                      pending: false,
                      previewIndex: welcomeMessage.previewIndex,
                      price: welcomeMessage.price ?? 0,
                      reverted: false,
                      senderId: user?.userId ?? "",
                      sentAt: new Date(),
                      automatic: false
                    }}
                    ownsMessage
                  />
                )}
              </div>
            )}
          </div>

          <Button
            className="mt-6 w-auto !px-[52px]"
            disabled={isLoading || !isDirty || isSubmitting}
            type={ButtonTypeEnum.SUBMIT}
          >
            <span>Save</span>
          </Button>
        </form>
      )}
    </AuthWrapper>
  )
}

export default memo(ChatSettings) // eslint-disable-line import/no-default-export
