import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
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
            <span
              className={classNames(
                "group flex cursor-pointer items-center py-3 pr-0 text-left text-base text-[17px] font-[500] tracking-[0.003em]",
                isItemActive
                  ? "text-passes-primary-color"
                  : "text-white hover:text-white/50"
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  isItemActive
                    ? "fill-transparent stroke-passes-primary-color stroke-2"
                    : "stroke-white group-hover:stroke-white/50",
                  "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-2"
                )}
              />
              {item.name}
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
