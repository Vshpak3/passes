export enum TabsEnum {
  "AccountSettings",
  "ChatSettings",
  "NotificationEmailSettings",
  "PrivacySafetySettings",
  "PaymentSettings",
  "WalletSettings",
  "PayoutSettings"
}

export const tabs = [
  {
    name: "Account Settings",
    id: TabsEnum.AccountSettings,
    creatorOnly: false
  },
  { name: "Chat Settings", id: TabsEnum.ChatSettings, creatorOnly: true },
  {
    name: "Notifications & Emails Settings",
    id: TabsEnum.NotificationEmailSettings,
    creatorOnly: false
  },
  {
    name: "Privacy & Safety Settings",
    id: TabsEnum.PrivacySafetySettings,
    creatorOnly: true
  },
  {
    name: "Payment Settings",
    id: TabsEnum.PaymentSettings,
    creatorOnly: false
  },
  {
    name: "Wallet Settings",
    id: TabsEnum.WalletSettings,
    creatorOnly: false
  },
  {
    name: "Payout Settings",
    id: TabsEnum.PayoutSettings,
    creatorOnly: true
  }
]

export const tabToPath: Record<TabsEnum, string> = {
  [TabsEnum.AccountSettings]: "account",
  [TabsEnum.ChatSettings]: "chat",
  [TabsEnum.NotificationEmailSettings]: "notifications",
  [TabsEnum.PrivacySafetySettings]: "privacy",
  [TabsEnum.PaymentSettings]: "payment",
  [TabsEnum.WalletSettings]: "wallet",
  [TabsEnum.PayoutSettings]: "payout"
}

export const pathToTab = Object.keys(tabToPath).reduce((result, key) => {
  result[tabToPath[key as unknown as TabsEnum]] = parseInt(
    key as unknown as string
  )
  return result
}, {} as Record<string, TabsEnum>)

export enum SubTabsEnum {
  // Accounts
  "AccountInformation",
  "ChangePassword",
  "DeactivateAccount",
  "ProfilePicture",
  "DisplayName",
  "Username",

  // Notification
  "NotificationPreferences",
  "EmailNotifications",

  // PrivacySafety
  "ProfileSettings",
  "PostsSettings",
  "SafetySettings",
  "BlockedRestrictedAccounts",

  // Payment
  "PaymentSettings",
  "WalletSettings",
  "PayoutSettings",
  "AddBank",
  "AddCard",
  "PaymentHistory"
}

export const subTabToPath = {
  // Accounts
  [SubTabsEnum.AccountInformation]: "information",
  [SubTabsEnum.ChangePassword]: "password",
  [SubTabsEnum.DeactivateAccount]: "deactivate",
  [SubTabsEnum.ProfilePicture]: "picture",
  [SubTabsEnum.DisplayName]: "display",
  [SubTabsEnum.Username]: "username",

  // Notification
  [SubTabsEnum.NotificationPreferences]: "preferences",
  [SubTabsEnum.EmailNotifications]: "email",

  // PrivacySafety
  [SubTabsEnum.ProfileSettings]: "profile",
  [SubTabsEnum.PostsSettings]: "posts",
  [SubTabsEnum.SafetySettings]: "safety",
  [SubTabsEnum.BlockedRestrictedAccounts]: "blocked",

  // Payment
  [SubTabsEnum.PaymentSettings]: "payment",
  [SubTabsEnum.WalletSettings]: "wallet",
  [SubTabsEnum.PayoutSettings]: "payout",
  [SubTabsEnum.AddBank]: "bank",
  [SubTabsEnum.AddCard]: "card",
  [SubTabsEnum.PaymentHistory]: "history"
}

export const pathToSubTab = Object.keys(subTabToPath).reduce((result, key) => {
  result[subTabToPath[key as unknown as SubTabsEnum]] = parseInt(
    key as unknown as string
  )
  return result
}, {} as Record<string, SubTabsEnum>)
