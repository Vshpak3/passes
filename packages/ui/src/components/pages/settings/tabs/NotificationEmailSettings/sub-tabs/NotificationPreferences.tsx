import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import React from "react"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

const NotificationPreferences = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  return (
    <>
      <Tab
        withBack
        title="Notification Preferences"
        description="Select your preferences by notification type."
      >
        <div className="mt-6 px-2.5">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => addTabToStackHandler(SubTabsEnum.EmailNotifications)}
          >
            <span className="text-label"> Email Notifications</span>
            <ChevronRightIcon />
          </button>
        </div>
      </Tab>
    </>
  )
}

export default NotificationPreferences // eslint-disable-line import/no-default-export
