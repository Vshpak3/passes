import React from "react"
import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Tab } from "src/components/pages/settings/Tab"

// TODO: Needs backend integration
const accounts: { name: string; isBlocked: boolean }[] = [
  // { name: "Kianna Press", isBlocked: true },
  // { name: "Kianna Press", isBlocked: true },
  // { name: "Kianna Press", isBlocked: false },
  // { name: "Kianna Press", isBlocked: true },
  // { name: "Kianna Press", isBlocked: true }
]

export const BlockedRestrictedAccounts = () => {
  return (
    <Tab
      withBack
      title="Blocked & Restricted Accounts"
      description="When you block someone, that person won’t be able to follow or message you, and you won’t see notifications from them."
    >
      Coming Soon!!
      <div className="mt-5 space-y-[26px] px-2.5">
        {/* eslint-disable-next-line sonarjs/no-empty-collection */}
        {accounts.map(({ name, isBlocked }, i) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center space-x-2.5">
              <span className="h-12 w-12 overflow-hidden rounded-full border-2 border-passes-gray-600">
                <img
                  className="h-full w-full object-cover object-center"
                  src="/img/profile/select-profile-img.png"
                  alt="profile"
                />
              </span>
              <span className="text-base font-medium">{name}</span>
            </div>

            <Button
              variant="pink"
              className="w-auto !px-6"
              tag="button"
              disabled={!isBlocked}
              disabledClass="opacity-[0.5]"
              type={ButtonTypeEnum.SUBMIT}
            >
              <span>{isBlocked ? "Blocked" : "Block"}</span>
            </Button>
          </div>
        ))}
      </div>
    </Tab>
  )
}
