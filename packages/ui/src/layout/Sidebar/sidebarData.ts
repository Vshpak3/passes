import ProfileIcon from "public/icons/profile-edit-icon.svg"
import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import MyPassesIcon from "public/icons/sidebar-passes-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"
import VaultIcon from "public/icons/sidebar-vault-icon.svg"

export const navigation = [
  {
    id: "home",
    name: "Home",
    href: "/home",
    icon: HomeIcon,
    current: true,
    creatorOnly: false,
    showWithoutAuth: true
  },
  {
    id: "messages",
    name: "Messages",
    href: "/messages",
    icon: MessagesIcon,
    creatorOnly: false
  },
  {
    id: "passes",
    name: "My Passes",
    href: "/passes",
    icon: MyPassesIcon,
    creatorOnly: false
  },
  {
    id: "vault",
    name: "Vault",
    href: "/vault",
    icon: VaultIcon
  },
  {
    id: "tools",
    name: "Creator Tools",
    href: "",
    icon: CreatorToolsIcon,
    children: [
      {
        id: "manage-passes",
        name: "Manage Passes",
        href: "/tools/manage-passes"
      },
      {
        id: "my-passes",
        name: "My Passes",
        href: "/tools/manage-passes"
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
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    creatorOnly: false
  },
  {
    id: "profile",
    name: "Profile",
    href: "/test", // TODO update this
    icon: ProfileIcon
  }
]

export const collapsedNavigation = [
  {
    id: "manage-passes",
    name: "Manage Passes",
    href: "/tools/manage-passes"
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
