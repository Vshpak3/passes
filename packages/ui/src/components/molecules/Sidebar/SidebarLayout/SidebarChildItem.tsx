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
              ? "group ml-[-25px] cursor-pointer items-center rounded-[56px] bg-[#FFFEFF]/10 px-[25px] font-bold"
              : "text-bg-[#FFFEFF]/10 font-normal hover:text-white",
            "group flex cursor-pointer items-center py-[10px] text-sm tracking-[0.003em] text-white md:text-base"
          )}
        >
          {subItem.name}
        </span>
      </a>
    </Link>
  )
}
