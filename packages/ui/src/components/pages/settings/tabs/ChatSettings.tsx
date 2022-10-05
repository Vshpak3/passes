import { yupResolver } from "@hookform/resolvers/yup"
import { UpdateCreatorSettingsRequestDto } from "@passes/api-client"
import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import Tab from "src/components/pages/settings/Tab"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import { chatSettingsSchema } from "src/helpers/validation"
import { useCreatorSettings } from "src/hooks"

const defaultValues = {
  isWithoutTip: true,
  showWelcomeMessageInput: false,
  minimumTipAmount: "" as number | string,
  welcomeMessage: ""
}

const ChatSettings = () => {
  const { creatorSettings, isLoading, isUpdating, updateCreatorSettings } =
    useCreatorSettings()
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful }
  } = useForm<typeof defaultValues>({
    defaultValues,
    resolver: yupResolver(chatSettingsSchema)
  })
  const [isDisableBtn, setIsDisabledBtn] = useState(false)
  const values = watch()

  const saveChatSettingsHandler = async () => {
    const data: UpdateCreatorSettingsRequestDto = {}

    if (!values.isWithoutTip) {
      data.minimumTipAmount = +values.minimumTipAmount
    } else {
      data.minimumTipAmount = null
    }

    if (values.showWelcomeMessageInput) {
      data.welcomeMessage = values.welcomeMessage
    } else {
      data.welcomeMessage = null
    }

    await updateCreatorSettings(
      data,
      "chat settings have been changed successfully"
    )
  }

  useEffect(() => {
    // inject already saved values in fields
    const { welcomeMessage, minimumTipAmount } = creatorSettings

    if (welcomeMessage) {
      setValue("showWelcomeMessageInput", true)
    }

    if (minimumTipAmount) {
      setValue("isWithoutTip", false)
    }

    setValue("minimumTipAmount", minimumTipAmount || "")
    setValue("welcomeMessage", welcomeMessage || "")
  }, [creatorSettings, setValue])

  useEffect(() => {
    // all of the below code is just for validation and disable save button
    if (isUpdating) {
      setIsDisabledBtn(false)
      return
    }
    // if (creatorSettings) {
    //   const { welcomeMessage, minimumTipAmount } = creatorSettings

    //   const formattedValues = {
    //     isWithoutTip: values.isWithoutTip,
    //     showWelcomeMessageInput: values.showWelcomeMessageInput,
    //     minimumTipAmount: values.isWithoutTip
    //       ? minimumTipAmount || ""
    //       : +values.minimumTipAmount,
    //     welcomeMessage: values.showWelcomeMessageInput
    //       ? values.welcomeMessage
    //       : welcomeMessage || ""
    //   }

    //   // making copy of saved data to compare it with current data
    //   const savedData = {
    //     isWithoutTip: !minimumTipAmount,
    //     showWelcomeMessageInput: !!welcomeMessage,
    //     minimumTipAmount: minimumTipAmount || "",
    //     welcomeMessage: welcomeMessage || ""
    //   }

    //   if (_.isEqual(savedData, formattedValues)) {
    //     setIsDisabledBtn(true)
    //     return
    //   }
    // }

    // if fields does not satisfy schema, disable the button
    chatSettingsSchema
      .validate(values)
      .then(() => {
        return setIsDisabledBtn(false)
      })
      .catch(() => {
        setIsDisabledBtn(true)
      })
  }, [values, creatorSettings, isUpdating])

  return (
    <>
      <Tab
        withBackMobile
        title="Chat Settings"
        description="Setup auto welcome message, and manage messages without tips."
      />
      <ConditionRendering condition={!isLoading}>
        <form className="mt-6" onSubmit={handleSubmit(saveChatSettingsHandler)}>
          <div
            className={classNames(
              "border-b border-passes-dark-200",
              values.isWithoutTip ? "pb-[22px]" : "pb-3"
            )}
          >
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">Accept messages without a Tip</span>
              <FormInput
                name="isWithoutTip"
                register={register}
                type="toggle"
              />
            </label>

            {!values.isWithoutTip && (
              <div className="relative">
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B728B]">
                  Minimum $5.00
                </span>
                <FormInput
                  placeholder="Enter Minimum Tip Amount"
                  name="minimumTipAmount"
                  type="number"
                  register={register}
                  className="mt-[22px] border-passes-gray-700/80 bg-transparent !py-4 !px-3 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                  errors={errors}
                />
              </div>
            )}
          </div>

          <div className="mt-[22px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-label">
                Send a welcome message to new fans
              </span>
              <FormInput
                name="showWelcomeMessageInput"
                register={register}
                type="toggle"
              />
            </label>

            {values.showWelcomeMessageInput && (
              <FormInput
                placeholder="Type a message..."
                name="welcomeMessage"
                type="text"
                register={register}
                className="mt-[22px] border-passes-gray-700/80 bg-transparent !py-4 !px-3 text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                errors={errors}
              />
            )}
          </div>

          <Button
            variant="pink"
            className="mt-6 w-auto !px-[52px]"
            tag="button"
            disabled={!isDisableBtn || isSubmitSuccessful}
            disabledClass="opacity-[0.5]"
            type={ButtonTypeEnum.SUBMIT}
          >
            <span>Save</span>
          </Button>
        </form>
      </ConditionRendering>
    </>
  )
}

const ChatSettingsCreatorWrapper = () => {
  return (
    <CreatorOnlyWrapper isPage>
      <ChatSettings />
    </CreatorOnlyWrapper>
  )
}

export default ChatSettingsCreatorWrapper
