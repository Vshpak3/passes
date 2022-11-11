import { yupResolver } from "@hookform/resolvers/yup"
import { UpdateCreatorSettingsRequestDto } from "@passes/api-client"
import classNames from "classnames"
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { boolean, mixed, number, object } from "yup"

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
import {
  MAX_TIP_MESSAGE_PRICE,
  MIN_TIP_MESSAGE_PRICE
} from "src/config/messaging"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"
import { useWelcomeMessage } from "src/hooks/settings/useWelcomeMessage"
import { useUser } from "src/hooks/useUser"

const defaultValues = {
  isWithoutTip: false,
  showWelcomeMessageInput: false,
  minimumTipAmount: ""
}

const chatSettingsSchema = object({
  isWithoutTip: boolean(),
  showWelcomeMessageInput: boolean(),
  minimumTipAmount: mixed().when("isWithoutTip", {
    is: false,
    then: number()
      .typeError("Please enter tip amount")
      .min(
        MIN_TIP_MESSAGE_PRICE,
        `Minimum tip amount is $${MIN_TIP_MESSAGE_PRICE}`
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
    setValue,
    formState: { errors },
    getValues,
    watch
  } = useForm<typeof defaultValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(chatSettingsSchema)
  })

  const isWithoutTip = watch("isWithoutTip")
  const showWelcomeMessageInput = watch("showWelcomeMessageInput")
  const saveChatSettingsHandler = async () => {
    const data: UpdateCreatorSettingsRequestDto = {}
    const values = getValues()
    if (!values.isWithoutTip) {
      data.minimumTipAmount = +values.minimumTipAmount
    } else {
      data.minimumTipAmount = null
    }

    data.welcomeMessage = !!values.showWelcomeMessageInput

    await updateCreatorSettings(
      data,
      "Chat settings have been updated successfully"
    )
  }

  useEffect(() => {
    // inject already saved values in fields

    setValue("showWelcomeMessageInput", !!creatorSettings?.welcomeMessage, {
      shouldValidate: true
    })

    setValue("isWithoutTip", !creatorSettings?.minimumTipAmount, {
      shouldValidate: true
    })

    setValue("minimumTipAmount", `${creatorSettings?.minimumTipAmount}`, {
      shouldValidate: true
    })
  }, [creatorSettings, setValue])

  return (
    <AuthWrapper creatorOnly isPage>
      <Tab
        description="Setup auto welcome message, and manage messages without tips."
        title="Chat Settings"
        withBackMobile
      />
      {!isLoading && (
        <form className="mt-6" onSubmit={handleSubmit(saveChatSettingsHandler)}>
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
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B728B]">
                Minimum ${MIN_TIP_MESSAGE_PRICE}
              </span>
              <NumberInput
                className="mt-[22px] min-h-[50px] border-passes-gray-700/80 bg-transparent !py-4 !px-3 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                errors={errors}
                maxInput={MAX_TIP_MESSAGE_PRICE}
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
              <div className="relative mt-[22px] rounded-md border border-passes-gray-700/80 !py-4 !px-3 focus:border-passes-secondary-color focus:ring-0">
                <input
                  className="w-full border-none bg-transparent text-[#ffff]/90"
                  placeholder={
                    welcomeMessage
                      ? "Default Welcome Message: "
                      : "No welcome message selected."
                  }
                  readOnly
                  type="text"
                />
                <div className="absolute top-1/4 right-0 pr-5">
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
            disabled={isLoading}
            disabledClass="opacity-[0.5]"
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
