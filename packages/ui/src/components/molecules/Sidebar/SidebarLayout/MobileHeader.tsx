import { Disclosure } from "@headlessui/react"
import MenuIcon from "public/icons/sidebar-menu-icon.svg"
import { FC } from "react"

import { CreatorSearchBar } from "src/layout/CreatorSearchBar"

interface MobileNavbarProps {
  openSidebar: () => void
}

export const MobileHeader: FC<MobileNavbarProps> = ({ openSidebar }) => {
  return (
    <div className="fixed top-0 left-0 z-30 flex h-16 w-full flex-1 items-center justify-between bg-[#252525]/50 backdrop-blur-lg">
      <Disclosure>
        <Disclosure.Button>
          <span
            className="group flex cursor-pointer items-center px-[10px]"
            onClick={openSidebar}
          >
            <div className="font-display group flex cursor-pointer items-center text-[26px] font-semibold text-white">
              <MenuIcon
                aria-hidden="true"
                className="cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-2 "
              />
            </div>
          </span>
        </Disclosure.Button>
      </Disclosure>
      <CreatorSearchBar isDesktop={false} />
    </div>
  )
}
