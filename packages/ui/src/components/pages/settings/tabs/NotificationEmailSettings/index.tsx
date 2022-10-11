import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import NotificationIcon from "public/icons/notification.svg"
import React from "react"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

const subTabs = [
  {
    name: "Notification Preferences",
    subText: "Select your preferences by notification type.",
    id: SubTabsEnum.NotificationPreferences,
    Icon: NotificationIcon
  }
]

export const NotificationEmailSettings = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  return (
    <Tab
      withBackMobile
      title="Notifications & Emails Settings"
      description="Select the notifications you receive about your activities, transactions, and recommendations."
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
                <span className="text-xs font-medium text-white/50 sm:text-base md:text-base">
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
