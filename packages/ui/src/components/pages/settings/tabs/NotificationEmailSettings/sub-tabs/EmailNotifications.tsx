import _ from "lodash"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { useNotificationSettings } from "src/hooks"
import useSWR from "swr"

import Tab from "../../../Tab"

interface INotificationSettings {
  emailNotifications: boolean
  directMessageEmails: boolean
  passesEmails: boolean
  paymentEmails: boolean
  postEmails: boolean
  marketingEmails: boolean
  mentionEmails: boolean
}

const EmailNotifications = () => {
  const { getNotificationSettings, updateNotificationSettings } =
    useNotificationSettings()
  const { data: notificationSettings, mutate } = useSWR(
    "/notification-settings",
    getNotificationSettings
  )
  const [formattedNotificationSettings, setFormattedNotificationSettings] =
    useState(null)

  const { register, handleSubmit, reset, watch } =
    useForm<INotificationSettings>()

  const saveNotificationSettingsHandler = async (
    values: INotificationSettings
  ) => {
    await updateNotificationSettings(values)
    mutate()
  }

  useEffect(() => {
    if (formattedNotificationSettings) {
      reset(formattedNotificationSettings)
    }
  }, [formattedNotificationSettings, reset])

  useEffect(() => {
    if (notificationSettings) {
      // replacing all 0s and 1s with true and false
      const notifications = JSON.parse(
        JSON.stringify(notificationSettings)
          .replaceAll("0", "false")
          .replaceAll("1", "true")
      )
      setFormattedNotificationSettings(notifications)
    }
  }, [notificationSettings])

  return (
    <Tab
      withBack
      title="Notification Preferences"
      description="Select your preferences by notification type."
    >
      <form
        className="mt-[22px]"
        onSubmit={handleSubmit(saveNotificationSettingsHandler)}
      >
        {/*<div className="border-b border-passes-dark-200 pb-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-label">Email Notifications</span>
            <FormInput
              name="emailNotifications"
              register={register}
              type="toggle"
            />
          </label>
          <p className="mt-2.5 text-white/50">
            Get emails to find out what’s going on when you’re not on Twitter.
            You can turn them off anytime.
          </p>
  </div>*/}

        <div className="mt-[22px]">
          <h4 className="text-label">Email Notification Types</h4>

          <div className="mt-[32px] space-y-[26px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">
                Direct Messages
              </span>
              <FormInput
                name="directMessageEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Passes</span>
              <FormInput
                name="passesEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Payments</span>
              <FormInput
                name="paymentEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Posts</span>
              <FormInput name="postEmails" register={register} type="toggle" />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">
                Passes Marketing & Product Update Emails
              </span>
              <FormInput
                name="marketingEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Mentions</span>
              <FormInput
                name="mentionEmails"
                register={register}
                type="toggle"
              />
            </label>
          </div>
        </div>

        <Button
          variant="pink"
          className="mt-[34px] w-auto !px-[52px]"
          tag="button"
          disabled={_.isEqual(watch(), formattedNotificationSettings)}
          disabledClass="opacity-[0.5]"
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default EmailNotifications
