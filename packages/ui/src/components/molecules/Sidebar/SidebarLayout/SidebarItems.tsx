import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import { FC, Fragment } from "react"

import { SidebarNavigation } from "./types"

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
      <span
        className={classNames(
          isActive
            ? "group ml-[-25px] hidden cursor-pointer items-center rounded-[56px] bg-[#FFFEFF]/10 py-[10px] px-[26px]"
            : "text-[#eeedef]/50 hover:text-white",
          "group  mt-[10px] mb-[19px] hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex"
        )}
      >
        {subItem.name}
      </span>
    </Link>
  )
}

interface SidebarDropdownProps {
  active: string
  item: SidebarNavigation
}

export const SidebarDropdown: FC<SidebarDropdownProps> = ({ active, item }) => {
  const router = useRouter()
  const isItemActive = item.id === active

  return (
    <Disclosure
      as={Fragment}
      key={item.name}
      defaultOpen={router.asPath.startsWith(`/${item.id}/`)}
    >
      {({ open }) => (
        <Fragment>
          <Disclosure.Button className="hidden sidebar-collapse:block">
            <span
              className={classNames(
                isItemActive
                  ? "rounded-[56px] bg-[#FFFEFF]/10"
                  : "hover:text-white",
                "group hidden cursor-pointer items-center py-[15px] px-[30px]  pr-0 sidebar-collapse:flex"
              )}
            >
              <Link
                href={item.href}
                as={item.href}
                passHref
                className={classNames(
                  isItemActive
                    ? "text-white"
                    : "text-[#eeedef]/50 group-hover:text-white",
                  "group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex"
                )}
              >
                <>
                  <item.icon
                    className={classNames(
                      isItemActive
                        ? "fill-transparent stroke-white stroke-2"
                        : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                      "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              </Link>
              <ChevronDown
                className={`ml-2 h-6 w-6 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel
              static
              className="hidden sidebar-collapse:block sidebar-collapse:pl-[67px]"
            >
              {item.children &&
                item.children.map((subItem: any) => {
                  const isActive = subItem.id === active
                  return (
                    <SidebarChildItem
                      key={subItem.id}
                      subItem={subItem}
                      isActive={isActive}
                    />
                  )
                })}
            </Disclosure.Panel>
          )}
        </Fragment>
      )}
    </Disclosure>
  )
}

interface SidebarItemProps {
  isActive: boolean
  item: SidebarNavigation
}

const SidebarTabletItem: FC<SidebarItemProps> = ({ isActive, item }) => {
  return (
    <span
      className={classNames(
        isActive
          ? "border border-solid border-passes-secondary-color bg-passes-secondary-color/10"
          : "hover:bg-passes-secondary-color/10 hover:text-white",
        "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
      )}
    >
      <Link
        href={item.href}
        as={item.href}
        passHref
        className={classNames(
          isActive ? "text-white" : "hover:text-white",
          "group flex"
        )}
      >
        <span>
          <item.icon
            className={classNames(
              isActive
                ? "fill-transparent stroke-white stroke-2"
                : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
              "flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
            )}
            aria-hidden="true"
          />
        </span>
      </Link>
    </span>
  )
}

const SidebarDesktopItem: FC<SidebarItemProps> = ({ isActive, item }) => {
  return (
    <span
      key={item.id}
      className={classNames(
        isActive
          ? "rounded-[56px] bg-[#FFFEFF]/10"
          : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
        "group hidden cursor-pointer items-center py-[15px] px-[30px] sidebar-collapse:flex"
      )}
    >
      <Link
        href={item.href}
        as={item.href}
        className={classNames(
          isActive ? "text-white" : "text-[#eeedef]/50 group-hover:text-white",
          "group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex"
        )}
      >
        <span className={classNames("flex flex-row")}>
          <item.icon
            className={classNames(
              isActive
                ? "fill-transparent stroke-white stroke-2"
                : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
              "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2"
            )}
            aria-hidden="true"
          />
          {item.name}
        </span>
      </Link>
    </span>
  )
}

export const SidebarItem: FC<SidebarItemProps> = ({ isActive, item }) => {
  return (
    <Fragment>
      <SidebarTabletItem isActive={isActive} item={item} />
      <SidebarDesktopItem isActive={isActive} item={item} />
    </Fragment>
  )
}
