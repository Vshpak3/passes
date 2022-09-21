import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { classNames } from "src/helpers"
import { chatSettingsSchema } from "src/helpers/validation"

import Tab from "../Tab"

const defaultValues = {
  withoutTip: true,
  showWelcomeMessageInput: false,
  tipAmount: "" as unknown as number,
  welcomeMessage: ""
}

const ChatSettings = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<typeof defaultValues>({
    defaultValues,
    resolver: yupResolver(chatSettingsSchema)
  })
  const [isValidate, setIsValidate] = useState(false)
  const values = watch()

  const saveChatSettingsHandler = ({
    tipAmount,
    welcomeMessage
  }: typeof defaultValues) => {
    console.log(tipAmount, welcomeMessage)
  }

  useEffect(() => {
    chatSettingsSchema
      .validate(values)
      .then(() => {
        return setIsValidate(true)
      })
      .catch(() => {
        setIsValidate(false)
      })
  }, [values])

  return (
    <>
      <Tab
        title="Chat Settings"
        description="Setup auto welcome message, and manage messages without tips."
      />

      <form className="mt-6" onSubmit={handleSubmit(saveChatSettingsHandler)}>
        <div
          className={classNames(
            "border-b border-passes-dark-200",
            values.withoutTip ? "pb-[22px]" : "pb-3"
          )}
        >
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Accept messages without a Tip</span>
            <FormInput name="withoutTip" register={register} type="toggle" />
          </label>

          {!values.withoutTip && (
            <div className="relative">
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B728B]">
                Minimum $5.00
              </span>
              <FormInput
                placeholder="Enter Minimum Tip Amount"
                name="tipAmount"
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
          disabled={!isValidate}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </>
  )
}

export default ChatSettings
