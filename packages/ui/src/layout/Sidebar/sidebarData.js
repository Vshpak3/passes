import ProfileIcon from "public/icons/profile-edit-icon.svg"
import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import NotificationIcon from "public/icons/sidebar-notification-icon.svg"
import PassesIcon from "public/icons/sidebar-passes-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"
import VaultIcon from "public/icons/sidebar-vault-icon.svg"

export const navigation = [
  { id: "home", name: "Home", href: "/home", icon: HomeIcon, current: true },
  {
    id: "messages",
    name: "Messages",
    href: "/messages",
    icon: MessagesIcon,
    current: false
  },
  {
    id: "vault",
    name: "Vault",
    href: "/vault",
    icon: VaultIcon,
    current: false
  },
  {
    id: "passes",
    name: "My Passes",
    href: "/passes",
    icon: PassesIcon,
    current: false
  },

  {
    id: "tools",
    name: "Creator Tools",
    icon: CreatorToolsIcon,
    current: false,
    children: [
      {
        id: "choice",
        name: "Manage Passes",
        href: "/tools/choice"
      },
      {
        id: "[collection]",
        name: "Pass Collection",
        href: "/tools/passes/collection"
      },
      {
        id: "purchase",
        name: "Purchase Pass",
        href: "/tools/purchase"
      },
      {
        id: "list",
        name: "List",
        href: "/tools/list"
      },
      {
        id: "analytics",
        name: "Analytics",
        href: "/tools/analytics"
      },
      {
        id: "earnings",
        name: "Earnings",
        href: "/tools/earnings"
      },
      {
        id: "payouts",
        name: "Payouts",
        href: "/tools/payouts"
      },
      {
        id: "scheduler",
        name: "Scheduler",
        href: "/tools/scheduler"
      }
    ]
  },
  {
    id: "notification",
    name: "Notification",
    href: "/notification",
    icon: NotificationIcon,
    current: false
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    current: false
  },
  {
    id: "profile",
    name: "Profile",
    href: "/test",
    icon: ProfileIcon,
    current: false
  }
]

export const collapsedNavigation = [
  {
    id: "choice",
    name: "Manage Passes",
    href: "/tools/choice"
  },
  {
    id: "[collection]",
    name: "Pass Collection",
    href: "/tools/passes/collection"
  },
  {
    id: "purchase",
    name: "Purchase Pass",
    href: "/tools/purchase"
  },
  {
    id: "list",
    name: "List",
    href: "/tools/list"
  },
  {
    id: "analytics",
    name: "Analytics",
    href: "/tools/analytics"
  },
  {
    id: "earnings",
    name: "Earnings",
    href: "/tools/earnings"
  },
  {
    id: "payouts",
    name: "Payouts",
    href: "/tools/payouts"
  },
  {
    id: "scheduler",
    name: "Scheduler",
    href: "/tools/scheduler"
  }
]
