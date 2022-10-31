import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import NotificationIcon from "public/icons/notification.svg"
import React, { memo } from "react"

import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"

const subTabs = [
  {
    name: "Email Notifications",
    subText: "Select your preferences for receiving emails.",
    id: SubTabsEnum.EmailNotifications,
    Icon: NotificationIcon
  }
]

const NotificationEmailSettings = () => {
  const { addTabToStackHandler } = useSettings() as SettingsContextProps
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

export default memo(NotificationEmailSettings) // eslint-disable-line import/no-default-export
