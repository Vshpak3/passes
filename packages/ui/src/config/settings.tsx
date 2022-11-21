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
    name: "Account",
    id: TabsEnum.AccountSettings,
    creatorOnly: false
  },
  { name: "Chat", id: TabsEnum.ChatSettings, creatorOnly: true },
  {
    name: "Notifications & Emails",
    id: TabsEnum.NotificationEmailSettings,
    creatorOnly: false
  },
  {
    name: "Privacy & Safety",
    id: TabsEnum.PrivacySafetySettings,
    creatorOnly: true
  },
  {
    name: "Payment",
    id: TabsEnum.PaymentSettings,
    creatorOnly: false
  },
  {
    name: "Wallet",
    id: TabsEnum.WalletSettings,
    creatorOnly: false
  },
  {
    name: "Payout",
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

export const pathToTab: Record<string, TabsEnum> = Object.fromEntries(
  Object.entries(tabToPath).map(([k, v]) => [v, parseInt(k)])
)

export enum SubTabsEnum {
  // Navigation
  "AccountSettings",
  "ChatSettings",
  "NotificationEmailSettings",
  "PrivacySafetySettings",

  // Accounts
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
  "PaymentSettings",
  "WalletSettings",
  "PayoutSettings",
  "AddBank",
  "AddCard",
  "PaymentHistory"
}

export const subTabToTab: Record<SubTabsEnum, TabsEnum> = {
  // Navigation
  [SubTabsEnum.AccountSettings]: TabsEnum.AccountSettings,
  [SubTabsEnum.ChatSettings]: TabsEnum.ChatSettings,
  [SubTabsEnum.NotificationEmailSettings]: TabsEnum.NotificationEmailSettings,
  [SubTabsEnum.PrivacySafetySettings]: TabsEnum.PrivacySafetySettings,

  // Accounts
  [SubTabsEnum.AccountInformation]: TabsEnum.AccountSettings,
  [SubTabsEnum.ChangePassword]: TabsEnum.AccountSettings,
  [SubTabsEnum.DeactivateAccount]: TabsEnum.AccountSettings,
  [SubTabsEnum.ProfilePicture]: TabsEnum.AccountSettings,
  [SubTabsEnum.DisplayName]: TabsEnum.AccountSettings,
  [SubTabsEnum.Username]: TabsEnum.AccountSettings,

  // Chat
  [SubTabsEnum.WelcomeMessage]: TabsEnum.ChatSettings,

  // Notification
  [SubTabsEnum.EmailNotifications]: TabsEnum.NotificationEmailSettings,

  // PrivacySafety
  [SubTabsEnum.ProfileSettings]: TabsEnum.PrivacySafetySettings,
  [SubTabsEnum.PostsSettings]: TabsEnum.PrivacySafetySettings,
  [SubTabsEnum.BlockedRestrictedAccounts]: TabsEnum.PrivacySafetySettings,

  // Payment
  [SubTabsEnum.PaymentSettings]: TabsEnum.PaymentSettings,
  [SubTabsEnum.WalletSettings]: TabsEnum.WalletSettings,
  [SubTabsEnum.PayoutSettings]: TabsEnum.PayoutSettings,
  [SubTabsEnum.AddBank]: TabsEnum.PayoutSettings,
  [SubTabsEnum.AddCard]: TabsEnum.PaymentSettings,
  [SubTabsEnum.PaymentHistory]: TabsEnum.PaymentSettings
}

export const tabToSubTab: Record<TabsEnum, SubTabsEnum> = {
  [TabsEnum.AccountSettings]: SubTabsEnum.AccountSettings,
  [TabsEnum.ChatSettings]: SubTabsEnum.ChatSettings,
  [TabsEnum.NotificationEmailSettings]: SubTabsEnum.NotificationEmailSettings,
  [TabsEnum.PrivacySafetySettings]: SubTabsEnum.PrivacySafetySettings,
  [TabsEnum.PaymentSettings]: SubTabsEnum.PaymentSettings,
  [TabsEnum.WalletSettings]: SubTabsEnum.WalletSettings,
  [TabsEnum.PayoutSettings]: SubTabsEnum.PayoutSettings
}

export const subTabToPath: Record<SubTabsEnum, string> = {
  // Navigation
  [SubTabsEnum.AccountSettings]: "account",
  [SubTabsEnum.ChatSettings]: "chat",
  [SubTabsEnum.NotificationEmailSettings]: "notifications",
  [SubTabsEnum.PrivacySafetySettings]: "privacy",

  // Accounts
  [SubTabsEnum.AccountInformation]: "account/information",
  [SubTabsEnum.ChangePassword]: "account/password",
  [SubTabsEnum.DeactivateAccount]: "account/deactivate",
  [SubTabsEnum.ProfilePicture]: "account/picture",
  [SubTabsEnum.DisplayName]: "account/display",
  [SubTabsEnum.Username]: "account/username",

  // Chat
  [SubTabsEnum.WelcomeMessage]: "chat/welcome-message",

  // Notification
  [SubTabsEnum.EmailNotifications]: "notifications/email",

  // PrivacySafety
  [SubTabsEnum.ProfileSettings]: "privacy/profile",
  [SubTabsEnum.PostsSettings]: "privacy/posts",
  [SubTabsEnum.BlockedRestrictedAccounts]: "privacy/blocked",

  // Payment
  [SubTabsEnum.PaymentSettings]: "payment",
  [SubTabsEnum.WalletSettings]: "wallet",
  [SubTabsEnum.PayoutSettings]: "payout",
  [SubTabsEnum.AddBank]: "payout/bank",
  [SubTabsEnum.AddCard]: "payment/card",
  [SubTabsEnum.PaymentHistory]: "payment/history"
}

export const pathToSubTab: Record<string, SubTabsEnum> = Object.fromEntries(
  Object.entries(subTabToPath).map(([k, v]) => [v, parseInt(k) as SubTabsEnum])
)
