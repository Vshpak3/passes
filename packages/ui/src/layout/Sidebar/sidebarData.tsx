import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import MyPassesIcon from "public/icons/sidebar-passes-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"

export interface SidebarNavigation {
  id: string
  name: string
  href: string
  icon?: any
  current?: boolean
  creatorOnly?: boolean
  showWithoutAuth?: boolean
  children?: SidebarNavigation[]
}

export const navigation: SidebarNavigation[] = [
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
    id: "tools",
    name: "Creator Tools",
    href: "",
    icon: CreatorToolsIcon,
    creatorOnly: true,
    children: [
      {
        id: "manage-passes",
        name: "Manage Passes",
        href: "/tools/manage-passes",
        creatorOnly: true
      },
      {
        id: "list",
        name: "List",
        href: "/tools/list",
        creatorOnly: true
      },
      {
        id: "vault",
        name: "Vault",
        href: "/tools/vault",
        creatorOnly: true
      },
      {
        id: "performance",
        name: "Performance",
        href: "/tools/performance",
        creatorOnly: true
      },
      {
        id: "earnings",
        name: "Earnings",
        href: "/tools/earnings",
        creatorOnly: true
      },
      {
        id: "payouts",
        name: "Payouts",
        href: "/tools/payouts",
        creatorOnly: true
      },
      {
        id: "scheduler",
        name: "Scheduler",
        href: "/tools/scheduler",
        creatorOnly: true
      }
    ]
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    creatorOnly: false
  }
]

export const collapsedNavigation: SidebarNavigation[] = [
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
