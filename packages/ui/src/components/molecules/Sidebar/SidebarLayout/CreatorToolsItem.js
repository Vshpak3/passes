import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import React from "react"

const CreatorToolsItem = ({ active, openCollapsedAdditionalSidebar }) => {
  return (
    <Disclosure>
      <Disclosure.Button>
        <span
          onClick={() => openCollapsedAdditionalSidebar("tools")}
          className={classNames(
            active === "tools"
              ? "border border-solid border-passes-secondary-color bg-passes-secondary-color/10"
              : "hover:bg-passes-secondary-color/10 hover:text-white",
            "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
          )}
        >
          <CreatorToolsIcon
            className={classNames(
              active === "tools"
                ? "fill-transparent stroke-white stroke-2"
                : "stroke-[#ffffff]/50 group-hover:stroke-[#ffffff]/80 ",
              "flex-shrink-0 cursor-pointer stroke-white stroke-2  "
            )}
            aria-hidden="true"
          />
        </span>
      </Disclosure.Button>
    </Disclosure>
  )
}

export default CreatorToolsItem
