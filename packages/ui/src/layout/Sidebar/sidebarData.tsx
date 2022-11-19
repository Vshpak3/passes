import CreatorToolsIcon from "public/icons/sidebar/creator-tools.svg"
import HomeIcon from "public/icons/sidebar/home.svg"
import MyPassesIcon from "public/icons/sidebar/membership.svg"
import MessagesIcon from "public/icons/sidebar/messages.svg"
import ProfileIcon from "public/icons/sidebar/profile.svg"
import SettingsIcon from "public/icons/sidebar/settings.svg"

import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { isProd } from "src/helpers/env"

const sidebarCreatorToolItems: SidebarNavigation[] = [
  ...(!isProd
    ? [
        {
          id: "manage-memberships",
          name: "Memberships",
          href: "/tools/manage-memberships",
          creatorOnly: true
        }
      ]
    : []),
  {
    id: "list",
    name: "Lists",
    href: "/tools/list",
    creatorOnly: true
  },
  {
    id: "pass-holder",
    name: "Pass Holders",
    href: "/tools/pass-holder",
    creatorOnly: true
  },
  {
    id: "vault",
    name: "Vault",
    href: "/tools/vault",
    creatorOnly: true
  },
  {
    id: "post-categories",
    name: "Post Categories",
    href: "/tools/post-categories",
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

export const sidebarMainItems: SidebarNavigation[] = [
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
    id: "memberships",
    name: "Memberships",
    href: "/memberships",
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
    children: sidebarCreatorToolItems
  },
  {
    id: "profile",
    name: "Profile",
    href: "",
    icon: ProfileIcon,
    creatorOnly: false
  }
]
