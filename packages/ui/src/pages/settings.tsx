import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import Header from "src/components/molecules/performance/Header"
import { SubTabsEnum, tabs, TabsEnum } from "src/config/settings"
import {
  ISettingsContext,
  SettingsProvider,
  useSettings
} from "src/contexts/settings"
import { classNames } from "src/helpers"
import { withPageLayout } from "src/layout/WithPageLayout"

import AccountSettings from "../components/pages/settings/tabs/AccountSettings"
import AccountInformation from "../components/pages/settings/tabs/AccountSettings/sub-tabs/AccountInformation"
import ChangePassword from "../components/pages/settings/tabs/AccountSettings/sub-tabs/ChangePassword"
import DeactivateAccount from "../components/pages/settings/tabs/AccountSettings/sub-tabs/DeactivateAccount"
import DisplayName from "../components/pages/settings/tabs/AccountSettings/sub-tabs/DisplayName"
import ProfilePicture from "../components/pages/settings/tabs/AccountSettings/sub-tabs/ProfilePicture"
import ChatSettings from "../components/pages/settings/tabs/ChatSettings"
import NotificationEmailSettings from "../components/pages/settings/tabs/NotificationEmailSettings"
import EmailNotifications from "../components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/EmailNotifications"
import NotificationPreferences from "../components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/NotificationPreferences"
import PaymentWalletSettings from "../components/pages/settings/tabs/PaymentWalletSettings"
import AddBank from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddBank"
import AddCard from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddCard"
import ManageBank from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageBank"
import ManageCard from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageCard"
import PaymentsSettings from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/PaymentsSettings"
import WalletManagementSettings from "../components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/WalletManagementSettings"
import PrivacySafetySettings from "../components/pages/settings/tabs/PrivacySafetySettings"
import BlockedRestrictedAccounts from "../components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/BlockedRestrictedAccounts"
import PostsSettings from "../components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/PostsSettings"
import ProfileSettings from "../components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/ProfileSettings"
import SafetySettings from "../components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/SafetySettings"
import { useUser } from "../hooks"
import Username from "./[username]"

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
