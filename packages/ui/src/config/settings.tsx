enum NavigationEnum {
  "AccountSettings",
  "ChatSettings",
  "NotificationEmailSettings",
  "PrivacySafetySettings",
  "PaymentSettings",
  "WalletSettings",
  "PayoutSettings"
}

export const navigation = [
  {
    name: "Account",
    id: NavigationEnum.AccountSettings,
    creatorOnly: false
  },
  { name: "Chat", id: NavigationEnum.ChatSettings, creatorOnly: true },
  {
    name: "Notifications & Emails",
    id: NavigationEnum.NotificationEmailSettings,
    creatorOnly: false
  },
  {
    name: "Privacy & Safety",
    id: NavigationEnum.PrivacySafetySettings,
    creatorOnly: true
  },
  {
    name: "Payment",
    id: NavigationEnum.PaymentSettings,
    creatorOnly: false
  },
  {
    name: "Wallet",
    id: NavigationEnum.WalletSettings,
    creatorOnly: false
  },
  {
    name: "Payout",
    id: NavigationEnum.PayoutSettings,
    creatorOnly: true
  }
]

enum _SubTabsEnum {
  // Account
  "AccountInformation",
  "ChangePassword",
  "DeactivateAccount",
  "ProfilePicture",
  "DisplayName",
  "Username",

  // Chat
  "WelcomeMessage",

  // Notification
  "EmailNotifications",

  // PrivacySafety
  "ProfileSettings",
  "PostsSettings",
  "BlockedRestrictedAccounts",

  // Payment
  "AddBank",
  "AddCard",
  "PaymentHistory"
}

// All primary tabs are also subtabs
export type SubTabsEnum = NavigationEnum | _SubTabsEnum
export const SubTabsEnum = { ...NavigationEnum, ..._SubTabsEnum }

export const subTabs: Record<
  SubTabsEnum,
  { path: string; nav: NavigationEnum }
> = {
  // Accounts
  [SubTabsEnum.AccountSettings]: {
    path: "account",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.AccountInformation]: {
    path: "account/information",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.ChangePassword]: {
    path: "account/password",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.DeactivateAccount]: {
    path: "account/deactivate",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.ProfilePicture]: {
    path: "account/picture",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.DisplayName]: {
    path: "account/display",
    nav: NavigationEnum.AccountSettings
  },
  [SubTabsEnum.Username]: {
    path: "account/username",
    nav: NavigationEnum.AccountSettings
  },

  // Chat
  [SubTabsEnum.ChatSettings]: {
    path: "chat",
    nav: NavigationEnum.ChatSettings
  },
  [SubTabsEnum.WelcomeMessage]: {
    path: "chat/welcome-message",
    nav: NavigationEnum.ChatSettings
  },

  // Notification
  [SubTabsEnum.NotificationEmailSettings]: {
    path: "notifications",
    nav: NavigationEnum.NotificationEmailSettings
  },
  [SubTabsEnum.EmailNotifications]: {
    path: "notifications/email",
    nav: NavigationEnum.NotificationEmailSettings
  },

  // PrivacySafety
  [SubTabsEnum.PrivacySafetySettings]: {
    path: "privacy",
    nav: NavigationEnum.PrivacySafetySettings
  },
  [SubTabsEnum.ProfileSettings]: {
    path: "privacy/profile",
    nav: NavigationEnum.PrivacySafetySettings
  },
  [SubTabsEnum.PostsSettings]: {
    path: "privacy/posts",
    nav: NavigationEnum.PrivacySafetySettings
  },
  [SubTabsEnum.BlockedRestrictedAccounts]: {
    path: "privacy/blocked",
    nav: NavigationEnum.PrivacySafetySettings
  },

  // Payment
  [SubTabsEnum.PaymentSettings]: {
    path: "payment",
    nav: NavigationEnum.PaymentSettings
  },
  [SubTabsEnum.WalletSettings]: {
    path: "wallet",
    nav: NavigationEnum.WalletSettings
  },
  [SubTabsEnum.PayoutSettings]: {
    path: "payout",
    nav: NavigationEnum.PayoutSettings
  },
  [SubTabsEnum.AddBank]: {
    path: "payout/bank",
    nav: NavigationEnum.PayoutSettings
  },
  [SubTabsEnum.AddCard]: {
    path: "payment/card",
    nav: NavigationEnum.PaymentSettings
  },
  [SubTabsEnum.PaymentHistory]: {
    path: "payment/history",
    nav: NavigationEnum.PaymentSettings
  }
}

export const navToSubTab: Record<number, SubTabsEnum> = Object.fromEntries(
  Object.keys(NavigationEnum)
    .filter((x) => isNaN(parseInt(x)))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .map((key) => [NavigationEnum[key], SubTabsEnum[key]])
)

export const pathToSubTab: Record<string, SubTabsEnum> = Object.fromEntries(
  Object.entries(subTabs).map(([k, v]) => [v.path, parseInt(k) as SubTabsEnum])
)
