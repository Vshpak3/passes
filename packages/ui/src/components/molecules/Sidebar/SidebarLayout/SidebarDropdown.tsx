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
      key={item.name}
      defaultOpen={router?.asPath.startsWith(`/${item.id}/`)}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="block">
            <span className="group flex cursor-pointer items-center py-3 pr-0 hover:text-white">
              <Link
                href={item.href}
                as={item.href}
                passHref
                className={classNames(
                  isItemActive
                    ? "text-passes-primary-color"
                    : "text-[#eeedef]/50 group-hover:text-white",
                  "group flex cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white"
                )}
              >
                <>
                  <item.icon
                    className={classNames(
                      isItemActive
                        ? "fill-transparent stroke-passes-primary-color stroke-2"
                        : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80",
                      "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </>
              </Link>
              <ChevronDown className={`ml-2 ${open ? "rotate-180" : ""}`} />
            </span>
          </Disclosure.Button>
          {open && (
            <Disclosure.Panel static className="block pl-[40px]">
              {item.children?.map((subItem) => (
                <SidebarItem
                  key={subItem.id}
                  item={subItem}
                  isActive={subItem.id === active}
                  isDropdown
                />
              ))}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}
