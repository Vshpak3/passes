import { GetNotificationSettingsResponseDto } from "@passes/api-client"
import { ChangeEvent, memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { errorMessage } from "src/helpers/error"
import { useNotificationSettings } from "src/hooks/settings/useNotificationSettings"

type NotificationSettingsFormProps = GetNotificationSettingsResponseDto

const EmailNotifications = () => {
  const {
    notificationSettings,
    updateNotificationSettings,
    loadingNotificationSettings
  } = useNotificationSettings()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty }
  } = useForm<NotificationSettingsFormProps>()

  const [isEmailAll, setIsEmailAll] = useState(false)

  const allEmailNotifications = watch()

  const onSubmit = async (values: NotificationSettingsFormProps) => {
    try {
      await updateNotificationSettings(values)
      toast.success("Email notifications has been changed")
      reset(undefined, { keepValues: true })
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const emailAllNotificationsHandler = (e: ChangeEvent<HTMLInputElement>) => {
    Object.keys(allEmailNotifications).forEach((field) => {
      setValue(field as keyof NotificationSettingsFormProps, e.target.checked, {
        shouldDirty: true
      })
    })
    setIsEmailAll(e.target.checked)
  }

  useEffect(() => {
    if (loadingNotificationSettings) {
      return
    }
    reset(notificationSettings)
  }, [loadingNotificationSettings, notificationSettings, reset])

  useEffect(() => {
    setIsEmailAll(Object.values(allEmailNotifications).some((n) => n))
  }, [allEmailNotifications])

  return (
    <Tab
      defaultSubTab={SubTabsEnum.NotificationEmailSettings}
      description="Select your preferences for receiving emails."
      title="Email Settings"
    >
      <div className="mt-[22px] border-b border-passes-dark-200 pb-3">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-label">Email Notifications</span>
          <Checkbox
            checked={isEmailAll}
            name="emailAllNotifications"
            onChange={emailAllNotificationsHandler}
            type="toggle"
          />
        </label>
        <p className="mt-2.5 text-white/50">
          Get emails to find out what’s going on when you’re not on Passes. You
          can turn them off anytime.
        </p>
      </div>
      <form className="mt-[22px]" onSubmit={handleSubmit(onSubmit)}>
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
          className="mt-[22px] w-auto !px-[52px] md:mt-[34px]"
          disabled={loadingNotificationSettings || !isDirty}
          type={ButtonTypeEnum.SUBMIT}
        >
          <span>Save</span>
        </Button>
      </form>
    </Tab>
  )
}

export default memo(EmailNotifications) // eslint-disable-line import/no-default-export
