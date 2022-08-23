import { Disclosure } from "@headlessui/react"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React, { Fragment } from "react"
import { classNames } from "src/helpers"

function SidebarChildItem({ subItem, isActive, setActive }) {
  return (
    <a
      key={subItem.name}
      href={subItem.href}
      as={subItem.href}
      onClick={() => setActive(subItem.id)}
      className={classNames(
        isActive
          ? "rounded-[56px] bg-[#FFFEFF]/10"
          : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
        `group ml-10 hidden cursor-pointer items-center py-[10px] px-[26px] sidebar-collapse:inline-block`
      )}
    >
      <span
        className={classNames(
          isActive ? "text-white" : "text-[#eeedef]/50 group-hover:text-white",
          `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
        )}
      >
        {subItem.name}
      </span>
    </a>
  )
}

function SidebarDropdown({ active, item, setActive, router }) {
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
                `group hidden cursor-pointer items-center py-[15px] px-[30px]  pr-0 sidebar-collapse:flex`
              )}
            >
              <a
                href={item.href}
                as={item.href}
                className={classNames(
                  isItemActive
                    ? "text-white"
                    : "text-[#eeedef]/50 group-hover:text-white",
                  `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
                )}
              >
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
              </a>

              <ChevronDown
                className={`ml-2 h-6 w-6 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel static className="hidden sidebar-collapse:block">
              {item.children.map((subItem) => {
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

function SidebarTabletItem({ isActive, item, setActive }) {
  return (
    <span
      onClick={setActive}
      className={classNames(
        isActive
          ? "border border-solid border-[#BF7AF0] bg-[#bf7af0]/10"
          : "hover:bg-[#bf7af0]/10 hover:text-white",
        "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
      )}
    >
      <a
        href={item.href}
        as={item.href}
        className={classNames(
          isActive ? "text-white" : "hover:text-white",
          "group flex"
        )}
      >
        <item.icon
          className={classNames(
            isActive
              ? "fill-transparent stroke-white stroke-2"
              : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
            "flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
          )}
          aria-hidden="true"
        />
      </a>
    </span>
  )
}

function SidebarDesktopItem({ isActive, item, setActive }) {
  return (
    <span
      onClick={setActive}
      key={item.id}
      className={classNames(
        isActive
          ? "rounded-[56px] bg-[#FFFEFF]/10"
          : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
        `group hidden cursor-pointer items-center py-[15px] px-[30px] sidebar-collapse:flex`
      )}
    >
      <a
        href={item.href}
        as={item.href}
        className={classNames(
          isActive ? "text-white" : "text-[#eeedef]/50 group-hover:text-white",
          `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
        )}
      >
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
    </span>
  )
}

function SidebarItem({ isActive, item, setActive }) {
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

export { SidebarDropdown, SidebarItem }
