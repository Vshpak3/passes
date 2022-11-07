import classNames from "classnames"
import Link from "next/link"
import HomeIcon from "public/icons/sidebar/home.svg"
import MessagesIcon from "public/icons/sidebar/messages.svg"
import MyPassesIcon from "public/icons/sidebar/passes.svg"
import SettingsIcon from "public/icons/sidebar/settings.svg"
import React from "react"

const mobileLinks = [
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
    id: "memberships",
    name: "Memberships",
    href: "/memberships",
    icon: MyPassesIcon,
    creatorOnly: false
  },
  {
    id: "messages",
    name: "Messages",
    href: "/messages",
    icon: MessagesIcon,
    creatorOnly: false
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    creatorOnly: false
  }
]

interface Props {
  activeRoute: string
}

export const MobileNavBar = ({ activeRoute }: Props) => {
  return (
    <div className="fixed bottom-0 z-30 flex h-16 w-full bg-passes-black">
      {mobileLinks.map((navBarItem, index) => (
        <Link
          className="flex flex-1 items-center justify-center"
          href={navBarItem.href}
          key={`${navBarItem.id}-${index}`}
        >
          <navBarItem.icon
            className={classNames(
              activeRoute === navBarItem.id
                ? " stroke-passes-primary-color stroke-2"
                : "stroke-[#ffffff]/50",
              " stroke-2"
            )}
          />
        </Link>
      ))}
    </div>
  )
}
