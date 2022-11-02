import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import Link from "next/link"
import { useRouter } from "next/router"
import ChevronDown from "public/icons/chevron-down.svg"
import { FC, Fragment } from "react"

import { SidebarItem } from "./SidebarItems"
import { SidebarNavigation } from "./Types"

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
      defaultOpen={router?.asPath.startsWith(`/${item.id}/`)}
      key={item.name}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="block">
            <span className="group flex cursor-pointer items-center py-3 pr-0 hover:text-white">
              <Link
                as={item.href}
                className={classNames(
                  isItemActive
                    ? "text-passes-primary-color"
                    : "text-[#eeedef]/50 group-hover:text-white",
                  "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
                )}
                href={item.href}
                passHref
              >
                <>
                  <item.icon
                    aria-hidden="true"
                    className={classNames(
                      isItemActive
                        ? "fill-transparent stroke-passes-primary-color stroke-2"
                        : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                      "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2"
                    )}
                  />
                  {item.name}
                </>
              </Link>
              <ChevronDown className={`ml-2 ${open ? "rotate-180" : ""}`} />
            </span>
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel className="block pl-[40px]" static>
              {item.children?.map((subItem) => (
                <SidebarItem
                  isActive={subItem.id === active}
                  isDropdown
                  item={subItem}
                  key={subItem.id}
                />
              ))}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}
