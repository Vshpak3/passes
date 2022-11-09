import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { SidebarNavigation } from "./Types"

interface SidebarItemProps {
  isActive: boolean
  item: SidebarNavigation
  isDropdown?: boolean
}

export const SidebarItem: FC<SidebarItemProps> = ({
  isActive,
  item,
  isDropdown
}) => {
  return (
    <Link
      as={item.href}
      className="group flex cursor-pointer items-center text-base font-[500] tracking-[0.003em]"
      href={item.href}
    >
      <span
        className={classNames(
          isDropdown ? "py-2" : "py-3",
          "group flex cursor-pointer items-center"
        )}
        key={item.id}
      >
        <span
          className={classNames(
            isActive
              ? "font-bold text-passes-primary-color"
              : "text-white group-hover:text-[#ffffff]/50",
            "flex flex-row text-[19px]"
          )}
        >
          {item.icon && (
            <item.icon
              aria-hidden="true"
              className={classNames(
                isActive
                  ? "text-fill-transparent stroke-passes-primary-color stroke-2"
                  : " stroke-[#ffffff] group-hover:stroke-[#ffffff]/50",
                "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-2"
              )}
            />
          )}
          {item.name}
        </span>
      </span>
    </Link>
  )
}
