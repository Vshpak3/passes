import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import React from "react"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

import Tab from "../../../Tab"

const SafetySettings = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext

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

export default SafetySettings
