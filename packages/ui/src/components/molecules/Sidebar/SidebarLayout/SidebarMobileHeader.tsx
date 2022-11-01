import { Disclosure } from "@headlessui/react"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import { FC } from "react"

interface SidebarMobileHeaderProps {
  toggleSidebar: () => void
}

export const SidebarMobileHeader: FC<SidebarMobileHeaderProps> = ({
  toggleSidebar
}) => {
  return (
    <Disclosure>
      <div className="border-r-[0.5px] border-gray-600">
        <Disclosure.Button>
          <span
            onClick={toggleSidebar}
            className="group my-4 mx-3 flex cursor-pointer items-center"
          >
            <div className="font-display group flex cursor-pointer items-center text-[26px] font-semibold text-white">
              <CloseIcon
                className="cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-2"
                aria-hidden="true"
              />
            </div>
          </span>
        </Disclosure.Button>
      </div>
    </Disclosure>
  )
}
