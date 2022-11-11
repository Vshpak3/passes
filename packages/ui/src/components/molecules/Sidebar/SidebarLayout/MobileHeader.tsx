import { Disclosure } from "@headlessui/react"
import SearchIcon from "public/icons/messages-search-icon.svg"
import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import MenuIcon from "public/icons/sidebar/menu.svg"
import { FC, useRef, useState } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"

interface MobileNavbarProps {
  openSidebar: () => void
}

export const MobileHeader: FC<MobileNavbarProps> = ({ openSidebar }) => {
  const { showTopNav } = useSidebarContext()
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
  const searchBarRef = useRef(null)

  const handleSearchClick = () => {
    setIsSearchBarOpen((searchBarState: boolean) => !searchBarState)
  }

  useOnClickOutside(searchBarRef, () => {
    setIsSearchBarOpen(false)
  })
  return (
    <>
      {showTopNav && (
        <div className="fixed top-0 left-0 z-30 flex h-16 w-full flex-1 items-center justify-between pl-3 backdrop-blur-lg">
          <Disclosure>
            <Disclosure.Button>
              <span
                className="group flex cursor-pointer items-center px-[10px]"
                onClick={openSidebar}
              >
                <div className="group flex cursor-pointer items-center text-[26px] font-[500] text-white">
                  <MenuIcon
                    aria-hidden="true"
                    className="cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-2"
                  />
                </div>
              </span>
            </Disclosure.Button>
          </Disclosure>
          <div>{!isSearchBarOpen && <PassesLogoPink className="mr-2" />}</div>
          {isSearchBarOpen ? (
            <div className="mx-2 w-full md:max-w-[50%]" ref={searchBarRef}>
              <CreatorSearchBar />
            </div>
          ) : (
            <Button
              className="mr-3"
              onClick={handleSearchClick}
              variant={ButtonVariant.NONE}
            >
              <SearchIcon height="25" width="25" />
            </Button>
          )}
        </div>
      )}
    </>
  )
}
