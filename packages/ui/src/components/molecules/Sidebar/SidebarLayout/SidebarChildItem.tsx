import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { SidebarNavigation } from "./Types"

interface SidebarChildItemProps {
  subItem: SidebarNavigation
  isActive: boolean
}

export const SidebarChildItem: FC<SidebarChildItemProps> = ({
  subItem,
  isActive
}) => {
  return (
    <Link key={subItem.name} href={subItem.href} as={subItem.href}>
      <a>
        <span
          className={classNames(
            isActive
              ? "group ml-[-25px] cursor-pointer items-center rounded-[56px] bg-[#FFFEFF]/10 px-[25px]"
              : "text-[#eeedef]/50 hover:text-white",
            "group flex cursor-pointer items-center py-[10px] text-base font-semibold tracking-[0.003em] text-white"
          )}
        >
          {subItem.name}
        </span>
      </a>
    </Link>
  )
}
