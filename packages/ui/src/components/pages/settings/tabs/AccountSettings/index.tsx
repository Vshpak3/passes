import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import KeyIcon from "public/icons/key.svg"
import UserIcon from "public/icons/user.svg"
import React from "react"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

const subTabs = [
  {
    name: "Account information",
    subText:
      "See your account information like your phone number and email address.",
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

const AccountSettings: React.FC = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  return (
    <Tab
      title="Account Settings"
      description="See information about your account, download an archive of your data, or learn about your account deactivation options"
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

export default AccountSettings
