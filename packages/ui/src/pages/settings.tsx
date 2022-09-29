import dynamic from "next/dynamic"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import Header from "src/components/molecules/performance/Header"
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
const NotificationPreferences = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/NotificationPreferences"
    )
)
const PaymentWalletSettings = dynamic(
  () => import("src/components/pages/settings/tabs/PaymentWalletSettings")
)
const AddBank = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddBank"
    )
)
const AddCard = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddCard"
    )
)
const ManageBank = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageBank"
    )
)
const ManageCard = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageCard"
    )
)
const PaymentsSettings = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/PaymentsSettings"
    )
)
const WalletManagementSettings = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/WalletManagementSettings"
    )
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
const SafetySettings = dynamic(
  () =>
    import(
      "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/SafetySettings"
    )
)
import { SubTabsEnum, tabs, TabsEnum } from "src/config/settings"
import {
  ISettingsContext,
  SettingsProvider,
  useSettings
} from "src/contexts/settings"
import { classNames } from "src/helpers"
import { withPageLayout } from "src/layout/WithPageLayout"

import { useUser } from "../hooks"

const Settings = () => {
  const { user } = useUser()
  const { activeTab, setActiveTab, subTabsStack } =
    useSettings() as ISettingsContext

  return (
    <>
      <Header />
      <div className="mx-auto flex h-full min-h-screen w-full max-w-[1235px] flex-1">
        <div className="min-w-[330px] max-w-[380px] border-r border-passes-dark-200 pt-6 pl-11">
          <div className="pr-[35px]">
            <h2 className="text-label-lg">Settings</h2>
          </div>
          <ul className="mt-6 -mr-px">
            {tabs
              .filter(({ creatorOnly }) => user?.isCreator || !creatorOnly)
              .map(({ name, id }) => (
                <li
                  key={id}
                  className={classNames(
                    "rounded-l-[4px] border-r p-2.5 pr-[13px]",
                    id === activeTab
                      ? "border-passes-primary-color bg-passes-primary-color/25"
                      : "border-transparent"
                  )}
                >
                  <button
                    className="text-label flex w-full items-center justify-between"
                    onClick={() => setActiveTab(id)}
                  >
                    <span>{name}</span>
                    <ChevronRightIcon />
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="w-full max-w-[830px] px-[29px] pt-6">
          {subTabsStack.length > 0
            ? renderSubTab(subTabsStack.slice(-1)[0])
            : renderTab(activeTab)}
        </div>
      </div>
    </>
  )
}

const SettingsWrapper = () => {
  return (
    <SettingsProvider>
      <Settings />
    </SettingsProvider>
  )
}

export default withPageLayout(SettingsWrapper, { header: false })

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
    case TabsEnum.PaymentWalletSettings:
      return <PaymentWalletSettings />
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
      return <PaymentsSettings />
    case SubTabsEnum.WalletManagementSettings:
      return <WalletManagementSettings />
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
    case SubTabsEnum.ManageBank:
      return <ManageBank />
    case SubTabsEnum.AddBank:
      return <AddBank />
    case SubTabsEnum.ManageCard:
      return <ManageCard />
    case SubTabsEnum.AddCard:
      return <AddCard />
  }
}
