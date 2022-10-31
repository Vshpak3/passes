import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import PostIcon from "public/icons/post.svg"
import SafetyIcon from "public/icons/safety.svg"
import UserIcon from "public/icons/user.svg"
import { memo } from "react"

import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"

const subTabs = [
  {
    name: "Profile",
    subText: "Manage what information your fans see.",
    id: SubTabsEnum.ProfileSettings,
    Icon: UserIcon
  },
  {
    name: "Posts",
    subText: "Enable or disable comments.",
    id: SubTabsEnum.PostsSettings,
    Icon: PostIcon
  },
  {
    name: "Safety",
    subText: "Manage blocked and restricted.",
    id: SubTabsEnum.SafetySettings,
    Icon: SafetyIcon
  }
]

const PrivacySafetySettings = () => {
  const { addTabToStackHandler } = useSettings() as SettingsContextProps

  return (
    <Tab
      withBackMobile
      title="Privacy & Safety Settings"
      description="Manage what information you and your fans see and share on Twitter."
    >
      <ul className="mt-[34px]">
        {subTabs.map(({ Icon, id, name, subText }) => (
          <li key={id}>
            <button
              className="flex w-full items-center space-x-4 p-2.5 text-left hover:bg-passes-primary-color/25 sm:space-x-6"
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

export default memo(PrivacySafetySettings) // eslint-disable-line import/no-default-export
