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
