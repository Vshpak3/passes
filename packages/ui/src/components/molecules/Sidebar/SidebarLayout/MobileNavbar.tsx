import { Disclosure } from "@headlessui/react"
import MenuIcon from "public/icons/sidebar-menu-icon.svg"
import { FC } from "react"

interface MobileNavbarProps {
  openSidebar: any
}

const MobileNavbar: FC<MobileNavbarProps> = ({ openSidebar }) => {
  return (
    <div className="fixed top-0 left-0 z-30 flex h-16 w-full flex-1 items-center justify-between bg-[#252525]/50 backdrop-blur-lg md:hidden">
      <Disclosure>
        <Disclosure.Button>
          <span
            onClick={openSidebar}
            className="group flex cursor-pointer items-center px-[10px]"
          >
            <div className="font-display group flex cursor-pointer items-center text-[26px] font-semibold text-white">
              <MenuIcon
                className="mx-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-white stroke-2 "
                aria-hidden="true"
              />
              Passes
            </div>
          </span>
        </Disclosure.Button>
      </Disclosure>
    </div>
  )
}

export default MobileNavbar
