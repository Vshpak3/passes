export enum TabsEnum {
  "AccountSettings",
  "ChatSettings",
  "NotificationEmailSettings",
  "PaymentWalletSettings",
  "PrivacySafetySettings"
}

export const tabs = [
  { name: "Account Settings", id: TabsEnum.AccountSettings },
  { name: "Chat Settings", id: TabsEnum.ChatSettings },
  {
    name: "Notifications & Emails Settings",
    id: TabsEnum.NotificationEmailSettings
  },
  { name: "Privacy & Safety Settings", id: TabsEnum.PrivacySafetySettings },
  { name: "Payment & Wallet Settings", id: TabsEnum.PaymentWalletSettings }
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
