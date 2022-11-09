import cn from "classnames"
import dynamic from "next/dynamic"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { FC, useEffect } from "react"

import {
  pathToSubTab,
  pathToTab,
  SubTabsEnum,
  tabs,
  TabsEnum
} from "src/config/settings"
import {
  SettingsContextProps,
  SettingsProvider,
  useSettings
} from "src/contexts/Settings"
import { useUser } from "src/hooks/useUser"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const AccountSettings = dynamic(
  () => import("src/components/pages/settings/tabs/AccountSettings")
)
const AccountInformation = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/AccountInformation"
    )
)
const ChangePassword = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ChangePassword"
    )
)
const DeactivateAccount = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DeactivateAccount"
    )
)
const DisplayName = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DisplayName"
    )
)
const ProfilePicture = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ProfilePicture"
    )
)
const Username = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/AccountSettings/sub-tabs/Username"
    )
)
const ChatSettings = dynamic(
  () => import("src/components/pages/settings/tabs/ChatSettings")
)
const NotificationEmailSettings = dynamic(
  () => import("src/components/pages/settings/tabs/NotificationEmailSettings")
)
const EmailNotifications = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/EmailNotifications"
    )
)
const PaymentSettings = dynamic(
  () => import("src/components/pages/settings/tabs/PaymentSettings/index")
)
const AddBank = dynamic(
  () =>
    import("src/components/pages/settings/tabs/PayoutSettings/sub-tabs/AddBank")
)
const AddCard = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
    )
)
const WalletSettings = dynamic(
  () => import("src/components/pages/settings/tabs/WalletSettings")
)
const PrivacySafetySettings = dynamic(
  () => import("src/components/pages/settings/tabs/PrivacySafetySettings")
)
const BlockedRestrictedAccounts = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/BlockedRestrictedAccounts"
    )
)
const PostsSettings = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/PostsSettings"
    )
)
const ProfileSettings = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/ProfileSettings"
    )
)
const PaymentHistory = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/PaymentHistory"
    )
)
const PayoutSettings = dynamic(
  () => import("src/components/pages/settings/tabs/PayoutSettings/index")
)
export interface SettingsPageProps {
  settingsPath?: string[]
}

export const SettingsPage: FC<SettingsPageProps> = ({ settingsPath }) => {
  const { user } = useUser()
  const {
    activeTab,
    setActiveTab,
    subTabsStack,
    setSubTabsStack,
    showSettingsTab,
    setShowSettingsTab
  } = useSettings() as SettingsContextProps
  const { isMobile } = useWindowSize()

  useEffect(() => {
    if (!settingsPath) {
      return
    }

    const tab = pathToTab[settingsPath[0]]
    const subTabs =
      settingsPath.slice(1, settingsPath.length)?.map((t) => pathToSubTab[t]) ||
      []
    setActiveTab(tab || 0)
    setSubTabsStack(subTabs)
    // If mobile viewport, ensure that the actual tab content is shown,
    // not the parent tabs. ie. show the <AccountSettings />
    // instead of the tabs with "Account Settings" highlighted
    if (isMobile) {
      setShowSettingsTab(true)
    }
    // Leave out settingsPath
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveTab, setSubTabsStack, isMobile])

  // If on desktop, set AccountSettings to active by default
  useEffect(() => {
    if (!settingsPath && !isMobile && !activeTab) {
      setActiveTab(TabsEnum.AccountSettings)
    }
  }, [settingsPath, isMobile, activeTab, setActiveTab])

  if (isMobile === undefined) {
    return null
  }
  return (
    <div className="flex h-full min-h-screen w-full">
      <div
        className={cn("flex-1 flex-shrink-0 px-4 md:block md:min-w-[330px]", {
          hidden: showSettingsTab
        })}
      >
        <div className="mx-auto h-full w-full border-r border-passes-dark-200 pt-2">
          <ul className="mt-6 -mr-px">
            {tabs
              .filter(({ creatorOnly }) => user?.isCreator || !creatorOnly)
              .map(({ name, id }) => (
                <li
                  className={cn(
                    "rounded-l-[4px] border-r p-2.5 pr-[13px]",
                    id === activeTab
                      ? "border-passes-primary-color bg-passes-primary-color/25"
                      : "border-transparent"
                  )}
                  key={id}
                >
                  <button
                    className="text-label flex w-full items-center justify-between"
                    onClick={() => {
                      setShowSettingsTab(true)
                      setActiveTab(id)
                      setSubTabsStack([])
                    }}
                  >
                    <span>{name}</span>
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div
        className={cn(
          "w-full overflow-x-hidden px-3 pt-6 sm:px-[29px] md:block md:max-w-[830px] md:px-5",
          { hidden: !showSettingsTab }
        )}
      >
        {subTabsStack.length > 0
          ? renderSubTab(subTabsStack.slice(-1)[0])
          : renderTab(activeTab)}
      </div>
    </div>
  )
}

export const SettingsWrapper: FC<SettingsPageProps> = ({ settingsPath }) => {
  return (
    <SettingsProvider>
      <SettingsPage settingsPath={settingsPath} />
    </SettingsProvider>
  )
}

const renderTab = (tab: TabsEnum) => {
  switch (tab) {
    case TabsEnum.AccountSettings:
      return <AccountSettings />
    case TabsEnum.ChatSettings:
      return <ChatSettings />
    case TabsEnum.NotificationEmailSettings:
      return <NotificationEmailSettings />
    case TabsEnum.PrivacySafetySettings:
      return <PrivacySafetySettings />
    case TabsEnum.PaymentSettings:
      return <PaymentSettings />
    case TabsEnum.WalletSettings:
      return <WalletSettings />
    case TabsEnum.PayoutSettings:
      return <PayoutSettings />
  }
}

const renderSubTab = (tab: SubTabsEnum) => {
  switch (tab) {
    case SubTabsEnum.AccountInformation:
      return <AccountInformation />
    case SubTabsEnum.ChangePassword:
      return <ChangePassword />
    case SubTabsEnum.DeactivateAccount:
      return <DeactivateAccount />
    case SubTabsEnum.PaymentSettings:
      return <PaymentSettings />
    case SubTabsEnum.WalletSettings:
      return <WalletSettings />
    case SubTabsEnum.ProfilePicture:
      return <ProfilePicture />
    case SubTabsEnum.DisplayName:
      return <DisplayName />
    case SubTabsEnum.Username:
      return <Username />
    case SubTabsEnum.EmailNotifications:
      return <EmailNotifications />
    case SubTabsEnum.ProfileSettings:
      return <ProfileSettings />
    case SubTabsEnum.PostsSettings:
      return <PostsSettings />
    case SubTabsEnum.BlockedRestrictedAccounts:
      return <BlockedRestrictedAccounts />
    case SubTabsEnum.AddBank:
      return <AddBank />
    case SubTabsEnum.AddCard:
      return <AddCard />
    case SubTabsEnum.PaymentHistory:
      return <PaymentHistory />
  }
}

export default WithNormalPageLayout(SettingsWrapper, {
  header: true,
  headerTitle: "Settings",
  background: false
})
