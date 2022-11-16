import { Disclosure } from "@headlessui/react"
import SearchIcon from "public/icons/messages-search-icon.svg"
import MenuIcon from "public/icons/sidebar/menu.svg"
import { FC, useRef, useState } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { useUser } from "src/hooks/useUser"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"

interface MobileNavbarProps {
  openSidebar: () => void
}

export const MobileHeader: FC<MobileNavbarProps> = ({ openSidebar }) => {
  const { showTopNav } = useSidebarContext()
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)
  const searchBarRef = useRef(null)
  const { user, loading } = useUser()

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
                    className="cursor-pointer fill-transparent stroke-white/30 stroke-2"
                  />
                </div>
              </span>
            </Disclosure.Button>
          </Disclosure>
          {(loading || !!user) &&
            (isSearchBarOpen ? (
              <div className="mx-2 w-full max-w-[400px]" ref={searchBarRef}>
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
            ))}
        </div>
      )}
    </>
  )
}
