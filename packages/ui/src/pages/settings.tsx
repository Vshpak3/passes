import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import Header from "src/components/molecules/performance/Header"
import AccountSettings from "src/components/pages/settings/tabs/AccountSettings"
import AccountInformation from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/AccountInformation"
import ChangePassword from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ChangePassword"
import DeactivateAccount from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DeactivateAccount"
import DisplayName from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DisplayName"
import ProfilePicture from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ProfilePicture"
import Username from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/Username"
import ChatSettings from "src/components/pages/settings/tabs/ChatSettings"
import NotificationEmailSettings from "src/components/pages/settings/tabs/NotificationEmailSettings"
import EmailNotifications from "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/EmailNotifications"
import NotificationPrefrences from "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/NotificationPrefrences"
import PaymentWalletSettings from "src/components/pages/settings/tabs/PaymentWalletSettings"
import AddBank from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddBank"
import AddCard from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/AddCard"
import ManageBank from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageBank"
import ManageCard from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/ManageCard"
import PaymentsSettings from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/PaymentsSettings"
import WalletManagementSettings from "src/components/pages/settings/tabs/PaymentWalletSettings/sub-tabs/WalletManagementSettings"
import PrivacySafetySettings from "src/components/pages/settings/tabs/PrivacySafetySettings"
import BlockedRestrictedAccounts from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/BlockedRestrictedAccounts"
import PostsSettings from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/PostsSettings"
import ProfileSettings from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/ProfileSettings"
import SafetySettings from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/SafetySettings"
import { SubTabsEnum, tabs, TabsEnum } from "src/config/settings"
import {
  ISettingsContext,
  SettingsProvider,
  useSettings
} from "src/contexts/settings"
import { classNames } from "src/helpers"
import { withPageLayout } from "src/layout/WithPageLayout"

const Settings = () => {
  const { activeTab, setActiveTab, subTabsStack } =
    useSettings() as ISettingsContext

  return (
    <>
      <Header />
      <div className="mx-auto flex h-full min-h-screen w-full max-w-[1235px] flex-1">
        <div className="max-w-[380px] border-r border-passes-dark-200 pt-6 pl-11">
          <div className="pr-[35px]">
            <h2 className="text-label-lg">Settings</h2>
            <div className="relative mt-6 flex items-center gap-3">
              <SearchIcon className="pointer-events-none  absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
              <input
                type="search"
                name="search"
                id="search"
                autoComplete="off"
                placeholder="Search setting"
                className="form-input h-[51px] w-full min-w-[320px] rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0"
              />
            </div>
          </div>
          <ul className="mt-6 -mr-px">
            {tabs.map(({ name, id }) => (
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
      return <NotificationPrefrences />
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
