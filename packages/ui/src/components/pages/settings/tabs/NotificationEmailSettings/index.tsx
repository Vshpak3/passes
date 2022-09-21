import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import NotificationIcon from "public/icons/notification.svg"
import React from "react"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

import Tab from "../../Tab"

const subTabs = [
  {
    name: "Notification Preferences",
    subText: "Select your preferences by notification type.",
    id: SubTabsEnum.NotificationPreferences,
    Icon: NotificationIcon
  }
]

const NotificationEmailSettings = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  return (
    <Tab
      title="Notifications & Emails Settings"
      description="Select the notifactions you receive about your activities, transactions, and recommendations."
    >
      <ul className="mt-[34px]">
        {subTabs.map(({ Icon, id, name, subText }) => (
          <li key={id}>
            <button
              onClick={() => addTabToStackHandler(id)}
              className="flex w-full items-center space-x-6 p-2.5 text-left hover:bg-passes-primary-color/25"
            >
              <Icon />
              <div className="flex-1">
                <h4 className="text-label">{name}</h4>
                <span className="text-base font-medium text-white/50">
                  {subText}
                </span>
              </div>
              <ChevronRightIcon />
            </button>
          </li>
        ))}
      </ul>
    </Tab>
  )
}

export default NotificationEmailSettings
