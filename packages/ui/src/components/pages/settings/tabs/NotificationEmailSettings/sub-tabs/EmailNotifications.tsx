import _ from "lodash"
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Tab } from "src/components/pages/settings/Tab"
import { errorMessage } from "src/helpers/error"
import { useNotificationSettings } from "src/hooks/settings/useNotificationSettings"

interface NotificationSettingsFormProps {
  directMessageEmails: boolean
  passesEmails: boolean
  paymentEmails: boolean
  postEmails: boolean
  marketingEmails: boolean
  mentionEmails: boolean
}

const EmailNotifications = () => {
  const { notificationSettings, updateNotificationSettings } =
    useNotificationSettings()

  const [formattedNotificationSettings, setFormattedNotificationSettings] =
    useState(null)

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<NotificationSettingsFormProps>()

  const [isEmailAll, setIsEmailAll] = useState(false)

  const allEmailNotifications = watch()

  const saveNotificationSettingsHandler = async (
    values: NotificationSettingsFormProps
  ) => {
    try {
      await updateNotificationSettings(values)
      toast.success("Email notifications has been changed")
    } catch (error) {
      errorMessage(error, true)
    }
  }

  const emailAllNotificationsHandler = (isEmailAll: boolean) => {
    Object.keys(allEmailNotifications).forEach((field) => {
      setValue(field as keyof NotificationSettingsFormProps, isEmailAll)
    })
  }

  useEffect(() => {
    const isAllDisabled = Object.values(allEmailNotifications).every((n) => !n)
    if (isAllDisabled) {
      setIsEmailAll(false)
    } else {
      setIsEmailAll(true)
    }
  }, [allEmailNotifications])

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
      title="Email Settings"
      description="Select your preferences for receiving emails."
    >
      <div className="mt-[22px] border-b border-passes-dark-200 pb-3">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-label">Email Notifications</span>
          <Checkbox
            name="emailAllNotifications"
            type="toggle"
            checked={isEmailAll}
            onChange={(e) => {
              emailAllNotificationsHandler(e.target.checked)
              setIsEmailAll(e.target.checked)
            }}
          />
        </label>
        <p className="mt-2.5 text-white/50">
          Get emails to find out what’s going on when you’re not on Passes. You
          can turn them off anytime.
        </p>
      </div>
      <form
        className="mt-[22px]"
        onSubmit={handleSubmit(saveNotificationSettingsHandler)}
      >
        <div>
          <h4 className="text-label">Email Notification Types</h4>

          <div className="mt-[32px] space-y-[26px]">
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">
                Direct Messages
              </span>
              <Checkbox
                name="directMessageEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Passes</span>
              <Checkbox name="passesEmails" register={register} type="toggle" />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Payments</span>
              <Checkbox
                name="paymentEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Posts</span>
              <Checkbox name="postEmails" register={register} type="toggle" />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">
                Passes Marketing & Product Update Emails
              </span>
              <Checkbox
                name="marketingEmails"
                register={register}
                type="toggle"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium leading-6">Mentions</span>
              <Checkbox
                name="mentionEmails"
                register={register}
                type="toggle"
              />
            </label>
          </div>
        </div>

        <Button
          variant="pink"
          className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
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

export default memo(EmailNotifications) // eslint-disable-line import/no-default-export
