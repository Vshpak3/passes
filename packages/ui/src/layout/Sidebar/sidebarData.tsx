import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import MyPassesIcon from "public/icons/sidebar-passes-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"

import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { isProd } from "src/helpers/env"

export const creatorToolsItems: SidebarNavigation[] = [
  ...(!isProd
    ? [
        {
          id: "manage-passes",
          name: "Manage Passes",
          href: "/tools/manage-passes",
          creatorOnly: true
        }
      ]
    : []),
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
    id: "analytics",
    name: "Analytics",
    href: "/tools/analytics",
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
    name: "Memberships",
    href: "/passes",
    icon: MyPassesIcon,
    creatorOnly: false
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    creatorOnly: false
  },
  {
    id: "tools",
    name: "Creator Tools",
    href: "",
    icon: CreatorToolsIcon,
    creatorOnly: true,
    children: creatorToolsItems
  }
]
