import { Disclosure } from "@headlessui/react"
import CloseIcon from "public/icons/sidebar/close.svg"
import { FC } from "react"

interface SidebarMobileHeaderProps {
  toggleSidebar: () => void
}

export const SidebarMobileHeader: FC<SidebarMobileHeaderProps> = ({
  toggleSidebar
}) => {
  return (
    <Disclosure>
      <Disclosure.Button>
        <span
          className="group m-4 flex cursor-pointer select-none items-center"
          onClick={toggleSidebar}
        >
          <div className="group flex items-center text-[26px] font-[500] text-white">
            <CloseIcon
              aria-hidden="true"
              className="fill-transparent stroke-[#ffffff]/30 stroke-2"
            />
          </div>
        </span>
      </Disclosure.Button>
    </Disclosure>
  )
}
