import cn from "classnames"
import dynamic from "next/dynamic"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { FC, useEffect } from "react"
import { Header } from "src/components/molecules/performance/Header"
import {
  pathToSubTab,
  pathToTab,
  SubTabsEnum,
  tabs,
  TabsEnum
} from "src/config/settings"
import {
  ISettingsContext,
  SettingsProvider,
  useSettings
} from "src/contexts/settings"
import { useUser } from "src/hooks/useUser"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const AccountSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/AccountSettings").then(
    (m) => m.AccountSettings
  )
)
const AccountInformation = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/AccountInformation"
  ).then((m) => m.AccountInformation)
)
const ChangePassword = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ChangePassword"
  ).then((m) => m.ChangePassword)
)
const DeactivateAccount = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DeactivateAccount"
  ).then((m) => m.DeactivateAccount)
)
const DisplayName = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DisplayName"
  ).then((m) => m.DisplayName)
)
const ProfilePicture = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ProfilePicture"
  ).then((m) => m.ProfilePicture)
)
const Username = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/AccountSettings/sub-tabs/Username"
  ).then((m) => m.Username)
)
const ChatSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/ChatSettings").then(
    (m) => m.ChatSettings
  )
)
const NotificationEmailSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/NotificationEmailSettings").then(
    (m) => m.NotificationEmailSettings
  )
)
const EmailNotifications = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/EmailNotifications"
  ).then((m) => m.EmailNotifications)
)
const NotificationPreferences = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/NotificationPreferences"
  ).then((m) => m.NotificationPreferences)
)
const PaymentSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/PaymentSettings/index").then(
    (m) => m.PaymentSettings
  )
)
const AddBank = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PayoutSettings/sub-tabs/AddBank"
  ).then((m) => m.AddBank)
)
const AddCard = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
  ).then((m) => m.AddCard)
)
const WalletSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/WalletSettings").then(
    (m) => m.WalletSettings
  )
)
const PrivacySafetySettings = dynamic(() =>
  import("src/components/pages/settings/tabs/PrivacySafetySettings").then(
    (m) => m.PrivacySafetySettings
  )
)
const BlockedRestrictedAccounts = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/BlockedRestrictedAccounts"
  ).then((m) => m.BlockedRestrictedAccounts)
)
const PostsSettings = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/PostsSettings"
  ).then((m) => m.PostsSettings)
)
const ProfileSettings = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/ProfileSettings"
  ).then((m) => m.ProfileSettings)
)
const SafetySettings = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/SafetySettings"
  ).then((m) => m.SafetySettings)
)
const PaymentHistory = dynamic(() =>
  import(
    "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/PaymentHistory"
  ).then((m) => m.PaymentHistory)
)
const PayoutSettings = dynamic(() =>
  import("src/components/pages/settings/tabs/PayoutSettings/index").then(
    (m) => m.PayoutSettings
  )
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
  } = useSettings() as ISettingsContext

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
    // Leave out settingsPath
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveTab, setSubTabsStack])

  return (
    <>
      <Header />
      <div className="mx-auto flex h-full min-h-screen w-full max-w-[1235px] flex-1">
        <div
          className={cn(
            "flex-1 flex-shrink-0 pl-[18px] pr-[25px] xs:px-8 sm:px-14 lg:block lg:min-w-[330px] lg:pl-11 lg:pr-0",
            { hidden: showSettingsTab }
          )}
        >
          <div className="mx-auto h-full w-full border-r border-passes-dark-200 pt-6">
            <div className="pr-[35px]">
              <h2 className="text-label-lg">Settings</h2>
            </div>
            <ul className="mt-6 -mr-px">
              {tabs
                .filter(({ creatorOnly }) => user?.isCreator || !creatorOnly)
                .map(({ name, id }) => (
                  <li
                    key={id}
                    className={cn(
                      "rounded-l-[4px] border-r p-2.5 pr-[13px]",
                      id === activeTab
                        ? "border-passes-primary-color bg-passes-primary-color/25"
                        : "border-transparent"
                    )}
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
            "w-full max-w-[830px] px-5 pt-6 sm:px-[29px] lg:block",
            { hidden: !showSettingsTab }
          )}
        >
          {subTabsStack.length > 0
            ? renderSubTab(subTabsStack.slice(-1)[0])
            : renderTab(activeTab)}
        </div>
      </div>
    </>
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
    case SubTabsEnum.NotificationPreferences:
      return <NotificationPreferences />
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
    case SubTabsEnum.SafetySettings:
      return <SafetySettings />
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

export default WithNormalPageLayout(SettingsWrapper, { header: false })
