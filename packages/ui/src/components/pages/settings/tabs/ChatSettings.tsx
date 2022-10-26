import { yupResolver } from "@hookform/resolvers/yup"
import { UpdateCreatorSettingsRequestDto } from "@passes/api-client"
import classNames from "classnames"
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { boolean, mixed, number, object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { FormInput } from "src/components/atoms/FormInput"
import { Tab } from "src/components/pages/settings/Tab"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useCreatorSettings } from "src/hooks/settings/useCreatorSettings"

const defaultValues = {
  isWithoutTip: false,
  showWelcomeMessageInput: false,
  minimumTipAmount: "",
  welcomeMessage: ""
}

const chatSettingsSchema = object({
  isWithoutTip: boolean(),
  showWelcomeMessageInput: boolean(),
  minimumTipAmount: mixed().when("isWithoutTip", {
    is: false,
    then: number()
      .typeError("Please enter tip amount")
      .min(5, "minimum tip amount is $5")
      .required("Please enter tip amount")
  }),
  welcomeMessage: string().when("showWelcomeMessageInput", {
    is: true,
    then: string().required("Please enter welcome message")
  })
})

const ChatSettings = () => {
  const { creatorSettings, isLoading, updateCreatorSettings } =
    useCreatorSettings()
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
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
      data.welcomeMessage = true
    } else {
      data.welcomeMessage = false
    }

    await updateCreatorSettings(
      data,
      "Chat settings have been updated successfully"
    )
  }

  useEffect(() => {
    // inject already saved values in fields

    if (creatorSettings?.welcomeMessage) {
      setValue("showWelcomeMessageInput", true)
    }

    if (creatorSettings?.minimumTipAmount) {
      setValue("isWithoutTip", false)
    }

    setValue("minimumTipAmount", `${creatorSettings?.minimumTipAmount}`)
    setValue("welcomeMessage", "")
  }, [creatorSettings, setValue])

  useEffect(() => {
    chatSettingsSchema
      .validate(values)
      .then(() => {
        return setIsDisabledBtn(false)
      })
      .catch(() => {
        setIsDisabledBtn(true)
      })
  }, [values, creatorSettings])

  return (
    <>
      <Tab
        withBackMobile
        title="Chat Settings"
        description="Setup auto welcome message, and manage messages without tips."
      />
      {!isLoading && (
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
            disabled={!isDisableBtn || isLoading}
            disabledClass="opacity-[0.5]"
            type={ButtonTypeEnum.SUBMIT}
          >
            <span>Save</span>
          </Button>
        </form>
      )}
    </>
  )
}

const ChatSettingsCreatorWrapper = () => {
  return (
    <AuthWrapper isPage creatorOnly={true}>
      <ChatSettings />
    </AuthWrapper>
  )
}

export default memo(ChatSettingsCreatorWrapper) // eslint-disable-line import/no-default-export
