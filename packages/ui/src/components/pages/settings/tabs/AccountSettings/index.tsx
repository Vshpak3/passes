import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import KeyIcon from "public/icons/key.svg"
import UserIcon from "public/icons/user.svg"
import React, { FC, memo } from "react"

import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"

const subTabs = [
  {
    name: "Account information",
    subText:
      "See your account information like your username and email address.",
    id: SubTabsEnum.AccountInformation,
    Icon: UserIcon
  },
  {
    name: "Change your password",
    subText: "Change your password at any time",
    id: SubTabsEnum.ChangePassword,
    Icon: KeyIcon
  }
  // Not supported for now
  // {
  //   name: "Deactivate your account",
  //   subText: "Find out how you can deactivate your account.",
  //   id: SubTabsEnum.DeactivateAccount,
  //   Icon: TrashIcon
  // }
]

const AccountSettings: FC = () => {
  const { addTabToStackHandler } = useSettings() as SettingsContextProps

  return (
    <Tab
      description="See information about your account, download an archive of your data, or learn about your account deactivation options"
      isRootTab
      title="Account Settings"
    >
      <ul className="mt-[34px]">
        {subTabs.map(({ Icon, id, name, subText }) => (
          <li key={id}>
            <button
              className="flex w-full items-center space-x-6 p-2.5 text-left hover:bg-passes-primary-color/25"
              onClick={() => addTabToStackHandler(id)}
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

export default memo(AccountSettings) // eslint-disable-line import/no-default-export
