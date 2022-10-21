import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import { FC, Fragment } from "react"

import { SidebarNavigation } from "./types"

interface SidebarMobileItemBaseProps {
  item: SidebarNavigation
  active: string
}

interface SidebarMobileItemProps extends SidebarMobileItemBaseProps {
  onClick: () => void
}

export const SidebarMobileChildItem: FC<SidebarMobileItemProps> = ({
  active,
  item,
  onClick
}) => {
  const isActive = item.id === active
  return (
    <Link key={item.name} as={item.href} href={item.href}>
      <span
        onClick={onClick}
        className={classNames(
          isActive
            ? "rounded-[56px] bg-[#FFFEFF]/10 text-white"
            : " group-hover:stroke-[#ffffff]/8 text-[#eeedef]/50 group-hover:text-white group-hover:text-white",
          "group group ml-5 flex flex cursor-pointer cursor-pointer items-center items-center py-[10px] px-[20px] text-base font-semibold tracking-[0.003em] text-white"
        )}
      >
        {item.name}
      </span>
    </Link>
  )
}

export const SidebarMobileItemInner: FC<SidebarMobileItemBaseProps> = ({
  item,
  active
}) => (
  <Link
    href={item.href}
    as={item.href}
    className={classNames(
      item.id === active
        ? "text-white"
        : "text-[#eeedef]/50 group-hover:text-white",
      "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
    )}
  >
    <div className="flex">
      <item.icon
        className={classNames(
          item.id === active
            ? "fill-transparent stroke-white stroke-2"
            : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
          "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
        )}
        aria-hidden="true"
      />
      <span>{item.name}</span>
    </div>
  </Link>
)

export const SidebarMobileDropdown: FC<SidebarMobileItemProps> = ({
  item,
  active,
  onClick
}) => {
  const router = useRouter()
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
              <div className="flex">
                <item.icon
                  className={classNames(
                    item.id === active
                      ? "fill-transparent stroke-white stroke-2"
                      : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                    "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
                  )}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </div>

              <ChevronDown
                className={`ml-2 h-6 w-6 ${open ? "rotate-180" : ""}`}
              />
            </span>
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel static>
              {item.children &&
                item.children.map((subItem: any) => (
                  <SidebarMobileChildItem
                    onClick={onClick}
                    key={subItem.id}
                    item={subItem}
                    active={active}
                  />
                ))}
            </Disclosure.Panel>
          )}
        </Fragment>
      )}
    </Disclosure>
  )
}

export const SidebarMobileItem: FC<SidebarMobileItemProps> = ({
  item,
  active,
  onClick
}) => {
  return (
    <span
      onClick={onClick}
      key={item.id}
      className={classNames(
        item.id === active
          ? "rounded-[56px] bg-[#FFFEFF]/10"
          : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
        "group flex cursor-pointer items-center py-[10px] px-[20px]"
      )}
    >
      <SidebarMobileItemInner item={item} active={active} />
    </span>
  )
}
