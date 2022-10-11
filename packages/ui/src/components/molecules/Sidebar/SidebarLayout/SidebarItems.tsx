import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import Link from "next/link"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React, { FC, Fragment } from "react"

interface SidebarChildItemProps {
  subItem: any
  isActive: any
  setActive: any
}

export const SidebarChildItem: FC<SidebarChildItemProps> = ({
  subItem,
  isActive,
  setActive
}) => {
  return (
    <Link
      key={subItem.name}
      href={subItem.href}
      as={subItem.href}
      onClick={() => setActive(subItem.id)}
    >
      <span
        className={classNames(
          isActive
            ? "group ml-[-25px] hidden cursor-pointer items-center rounded-[56px] bg-[#FFFEFF]/10 py-[10px] px-[26px]"
            : "text-[#eeedef]/50 hover:text-white",
          "group mb-[19px] hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex"
        )}
      >
        {subItem.name}
      </span>
    </Link>
  )
}

interface SidebarDropdownProps {
  active: any
  item: any
  setActive: any
  router: any
}

export const SidebarDropdown: FC<SidebarDropdownProps> = ({
  active,
  item,
  setActive,
  router
}) => {
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
              {item.children.map((subItem: any) => {
                const isActive = subItem.id === active
                return (
                  <SidebarChildItem
                    key={subItem.id}
                    subItem={subItem}
                    isActive={isActive}
                    setActive={setActive}
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

interface SidebarTabletItemProps {
  isActive: any
  item: any
  setActive: any
}

export const SidebarTabletItem: FC<SidebarTabletItemProps> = ({
  isActive,
  item,
  setActive
}) => {
  return (
    <span
      onClick={setActive}
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

interface SidebarDesktopItemProps {
  isActive: any
  item: any
  setActive: any
}

export const SidebarDesktopItem: FC<SidebarDesktopItemProps> = ({
  isActive,
  item,
  setActive
}) => {
  return (
    <span
      onClick={setActive}
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
        <a className={classNames("flex flex-row")}>
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
        </a>
      </Link>
    </span>
  )
}

interface SidebarItemProps {
  isActive: any
  item: any
  setActive: any
}

export const SidebarItem: FC<SidebarItemProps> = ({
  isActive,
  item,
  setActive
}) => {
  return (
    <Fragment>
      <SidebarTabletItem
        isActive={isActive}
        item={item}
        setActive={setActive}
      />
      <SidebarDesktopItem
        isActive={isActive}
        item={item}
        setActive={setActive}
      />
    </Fragment>
  )
}
