import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import React from "react"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { getFormattedDate } from "src/helpers"
import { useUser } from "src/hooks"

import Tab from "../../../Tab"

const AccountInformation = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  const { user } = useUser()

  return (
    <Tab
      withBack
      title="Account Information"
      description="See your account information like your phone number and email address."
    >
      <div className="mt-6 space-y-5 border-b border-passes-dark-200 pl-2.5 pb-2.5">
        <button
          className="flex w-full items-center justify-between"
          onClick={() => addTabToStackHandler(SubTabsEnum.ProfilePicture)}
        >
          <div className="text-start">
            <p className="text-label">Profile Picture</p>
            <p className="text-base font-medium text-white/50">
              Change your profile picture.
            </p>
          </div>
          <ChevronRightIcon />
        </button>

        <button
          className="flex w-full items-center justify-between"
          onClick={() => addTabToStackHandler(SubTabsEnum.DisplayName)}
        >
          <div className="text-start">
            <p className="text-label">Display Name</p>
            <p className="text-base font-medium text-white/50">
              {user?.displayName}
            </p>
          </div>
          <ChevronRightIcon />
        </button>

        <button
          className="flex w-full items-center justify-between"
          onClick={() => addTabToStackHandler(SubTabsEnum.Username)}
        >
          <div className="text-start">
            <p className="text-label">Username</p>
            <p className="text-base font-medium text-white/50">
              @{user?.username}
            </p>
          </div>
          <ChevronRightIcon />
        </button>

        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <p className="text-label">Email</p>
            <p className="text-base font-medium text-white/50">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between border-b border-passes-dark-200 p-2.5">
        <div className="text-start">
          <p className="text-label">Country</p>
          <p className="text-base font-medium text-white/50">
            {user?.countryCode}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between border-b border-passes-dark-200 p-2.5">
        <div className="text-start">
          <p className="text-label">Date of Birth</p>
          <p className="text-base font-medium text-white/50">
            {user?.birthday && getFormattedDate(new Date(user?.birthday))}
          </p>
        </div>
      </div>
    </Tab>
  )
}

export default AccountInformation
