export enum TabsEnum {
  "AccountSettings",
  "ChatSettings",
  "NotificationEmailSettings",
  "PaymentWalletSettings",
  "PrivacySafetySettings"
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
    creatorOnly: false
  },
  {
    name: "Payment & Wallet Settings",
    id: TabsEnum.PaymentWalletSettings,
    creatorOnly: false
  }
]

export enum SubTabsEnum {
  // Account
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
  "WalletManagementSettings",
  "ManageBank",
  "AddBank",
  "ManageCard",
  "AddCard"
}
