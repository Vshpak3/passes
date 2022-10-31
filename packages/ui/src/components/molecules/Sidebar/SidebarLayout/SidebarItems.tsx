import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { SidebarNavigation } from "./Types"

interface SidebarItemProps {
  isActive: boolean
  item: SidebarNavigation
}

export const SidebarItem: FC<SidebarItemProps> = ({ isActive, item }) => {
  return (
    <span
      key={item.id}
      className="group-hover:stroke-[#ffffff]/8 group flex cursor-pointer items-center py-3 px-6 group-hover:text-white"
    >
      <Link
        href={item.href}
        as={item.href}
        className={classNames(
          isActive
            ? "text-passes-primary-color"
            : "text-[#eeedef]/50 group-hover:text-white",
          "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
        )}
      >
        <a>
          <span
            className={classNames(
              isActive && "font-bold text-passes-primary-color",
              "flex flex-row"
            )}
          >
            <item.icon
              className={classNames(
                isActive
                  ? "text- fill-transparent stroke-passes-primary-color stroke-2"
                  : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2"
              )}
              aria-hidden="true"
            />
            {item.name}
          </span>
        </a>
      </Link>
    </span>
  )
}
