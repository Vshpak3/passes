import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { memo } from "react"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/settings"

const SafetySettings = () => {
  const { addTabToStackHandler } = useSettings() as SettingsContextProps

  return (
    <Tab withBack title="Safety" description="Manage blocked and restricted.">
      <div className="mt-6 px-2.5">
        <button
          className="flex w-full items-center justify-between"
          onClick={() =>
            addTabToStackHandler(SubTabsEnum.BlockedRestrictedAccounts)
          }
        >
          <span className="text-label">Blocked & Restricted Accounts</span>
          <ChevronRightIcon />
        </button>
      </div>
    </Tab>
  )
}

export default memo(SafetySettings) // eslint-disable-line import/no-default-export
