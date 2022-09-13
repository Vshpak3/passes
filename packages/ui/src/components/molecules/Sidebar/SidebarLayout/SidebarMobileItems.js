import { Disclosure } from "@headlessui/react"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React, { Fragment } from "react"
import { classNames } from "src/helpers"

function SidebarMobileChildItem({ active, subItem, setActive }) {
  const isActive = subItem.id === active
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
        "group ml-5 flex cursor-pointer items-center py-[10px] px-[20px]"
      )}
    >
      <span
        className={classNames(
          isActive ? "text-white" : "text-[#eeedef]/50 group-hover:text-white",
          "group  flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
        )}
      >
        {subItem.name}
      </span>
    </a>
  )
}

function SidebarMobileDropdown({ setActive, item, active, router }) {
  return (
    <Disclosure
      as={Fragment}
      key={item.name}
      defaultOpen={router.asPath.startsWith(`/${item.id}/`)}
    >
      {({ open }) => (
        <Fragment>
          <Disclosure.Button>
            <span
              className={classNames(
                item.id === active
                  ? "rounded-[56px] bg-[#FFFEFF]/10"
                  : "hover:text-white",
                "group flex cursor-pointer items-center py-[15px] px-[20px] pr-0"
              )}
            >
              <a
                href={item.href}
                as={item.href}
                className={classNames(
                  item.id === active
                    ? "text-white"
                    : "text-[#eeedef]/50 group-hover:text-white",
                  "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
                )}
              >
                <item.icon
                  className={classNames(
                    item.id === active
                      ? "fill-transparent stroke-white stroke-2"
                      : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                    "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
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
            <Disclosure.Panel static>
              {item.children.map((subItem) => (
                <SidebarMobileChildItem
                  key={subItem.id}
                  subItem={subItem}
                  active={active}
                  setActive={setActive}
                />
              ))}
            </Disclosure.Panel>
          )}
        </Fragment>
      )}
    </Disclosure>
  )
}

function SidebarMobileItem({ setActive, item, active }) {
  return (
    <span
      onClick={setActive}
      key={item.id}
      className={classNames(
        item.id === active
          ? "rounded-[56px] bg-[#FFFEFF]/10"
          : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
        "group flex cursor-pointer items-center py-[10px] px-[20px]"
      )}
    >
      <a
        href={item.href}
        as={item.href}
        className={classNames(
          item.id === active
            ? "text-white"
            : "text-[#eeedef]/50 group-hover:text-white",
          "group flex cursor-pointer items-center text-[16px] text-base font-semibold tracking-[0.003em] text-white"
        )}
      >
        <item.icon
          className={classNames(
            item.id === active
              ? "fill-transparent stroke-white stroke-2"
              : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
            "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
          )}
          aria-hidden="true"
        />
        {item.name}
      </a>
    </span>
  )
}

export { SidebarMobileDropdown, SidebarMobileItem }
