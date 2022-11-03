import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { SidebarNavigation } from "./Types"

interface SidebarItemProps {
  isActive: boolean
  item: SidebarNavigation
  isDropdown: boolean
}

export const SidebarItem: FC<SidebarItemProps> = ({
  isActive,
  item,
  isDropdown
}) => {
  return (
    <span
      className={classNames(
        isDropdown ? "py-2" : "py-3",
        "group-hover:stroke-[#ffffff]/8 group flex cursor-pointer items-center group-hover:text-white"
      )}
      key={item.id}
    >
      <Link
        as={item.href}
        className={classNames(
          isActive
            ? "text-passes-primary-color"
            : "text-[#eeedef]/50 group-hover:text-white",
          "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
        )}
        href={item.href}
      >
        <span
          className={classNames(
            isActive && "font-bold text-passes-primary-color",
            "flex flex-row"
          )}
        >
          {item.icon && (
            <item.icon
              aria-hidden="true"
              className={classNames(
                isActive
                  ? "text- fill-transparent stroke-passes-primary-color stroke-2"
                  : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-2"
              )}
            />
          )}
          {item.name}
        </span>
      </Link>
    </span>
  )
}
