import classNames from "classnames"
import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import { FC, useEffect } from "react"

import AccountSettings from "src/components/pages/settings/tabs/AccountSettings"
import AccountInformation from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/AccountInformation"
import ChangePassword from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ChangePassword"
import DeactivateAccount from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DeactivateAccount"
import DisplayName from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/DisplayName"
import ProfilePicture from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/ProfilePicture"
import Username from "src/components/pages/settings/tabs/AccountSettings/sub-tabs/Username"
import ChatSettings from "src/components/pages/settings/tabs/ChatSettings"
import WelcomeMessage from "src/components/pages/settings/tabs/ChatSettings/sub-tabs/WelcomeMessage"
import NotificationEmailSettings from "src/components/pages/settings/tabs/NotificationEmailSettings"
import EmailNotifications from "src/components/pages/settings/tabs/NotificationEmailSettings/sub-tabs/EmailNotifications"
import PaymentSettings from "src/components/pages/settings/tabs/PaymentSettings"
import AddCard from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
import PaymentHistory from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/PaymentHistory"
import PayoutSettings from "src/components/pages/settings/tabs/PayoutSettings"
import AddBank from "src/components/pages/settings/tabs/PayoutSettings/sub-tabs/AddBank"
import PrivacySafetySettings from "src/components/pages/settings/tabs/PrivacySafetySettings"
import BlockedRestrictedAccounts from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/BlockedRestrictedAccounts"
import PostsSettings from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/PostsSettings"
import ProfileSettings from "src/components/pages/settings/tabs/PrivacySafetySettings/sub-tabs/ProfileSettings"
import WalletSettings from "src/components/pages/settings/tabs/WalletSettings"
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
    navToActiveTab,
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
    <div className="flex h-full w-full border-t-[1px] border-passes-dark-200 lg:border-t-0">
      <div
        className={classNames(
          "flex-1 flex-shrink-0 px-4 md:block md:min-w-[330px]",
          {
            hidden: showSettingsTab
          }
        )}
      >
        <div className="mx-auto h-full w-full border-passes-dark-200 pt-2 md:border-r">
          <ul className="mt-6 -mr-px">
            {tabs
              .filter(({ creatorOnly }) => user?.isCreator || !creatorOnly)
              .map(({ name, id }) => (
                <li
                  className={classNames(
                    "rounded-l-[4px] p-2.5 pr-[13px]",
                    id === activeTab
                      ? "md:border-r md:border-passes-primary-color md:bg-passes-primary-color/25"
                      : "border-transparent"
                  )}
                  key={id}
                >
                  <button
                    className="text-label flex w-full items-center justify-between"
                    onClick={() => navToActiveTab(id)}
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
        className={classNames(
          "w-full overflow-x-hidden px-3 pt-5 sm:px-[29px] md:block md:max-w-[830px] md:px-5",
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

// eslint-disable-next-line react/no-multi-comp
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
    case SubTabsEnum.WelcomeMessage:
      return <WelcomeMessage />
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
  headerTitle: "Settings",
  background: false
})
