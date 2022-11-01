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
  // Accounts
  "AccountInformation",
  "ChangePassword",
  "DeactivateAccount",
  "ProfilePicture",
  "DisplayName",
  "Username",

  // Notification
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

export const subTabToPath: Record<SubTabsEnum, string> = {
  // Accounts
  [SubTabsEnum.AccountInformation]: "information",
  [SubTabsEnum.ChangePassword]: "password",
  [SubTabsEnum.DeactivateAccount]: "deactivate",
  [SubTabsEnum.ProfilePicture]: "picture",
  [SubTabsEnum.DisplayName]: "display",
  [SubTabsEnum.Username]: "username",

  // Notification
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

export const pathToSubTab: Record<string, SubTabsEnum> = Object.fromEntries(
  Object.entries(subTabToPath).map(([k, v]) => [v, parseInt(k) as SubTabsEnum])
)
