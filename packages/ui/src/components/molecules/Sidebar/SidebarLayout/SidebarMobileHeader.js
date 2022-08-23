import { Disclosure } from "@headlessui/react"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import React from "react"

const SidebarMobileHeader = ({ toggleSidebar }) => {
  return (
    <Disclosure>
      <Disclosure.Button>
        <span
          onClick={toggleSidebar}
          className="group mb-[30px] flex cursor-pointer items-center px-[10px]"
        >
          <div className="font-display group flex cursor-pointer items-center text-[26px] font-semibold text-white">
            <CloseIcon
              className="mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-white stroke-2 "
              aria-hidden="true"
            />
            Passes
          </div>
        </span>
      </Disclosure.Button>
    </Disclosure>
  )
}

export default SidebarMobileHeader
