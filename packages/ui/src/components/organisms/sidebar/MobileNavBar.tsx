import classNames from "classnames"
import Link from "next/link"
import { FC } from "react"

import { useSidebarContext } from "src/hooks/context/useSidebarContext"
import { useUser } from "src/hooks/useUser"
import { sidebarMainItems } from "src/layout/Sidebar/sidebarData"

const mobileLinks = new Set(["home", "memberships", "messages", "settings"])

interface MobileNavBarProps {
  activeRoute: string
}

export const MobileNavBar: FC<MobileNavBarProps> = ({
  activeRoute
}: MobileNavBarProps) => {
  const { user, loading } = useUser()

  const { showBottomNav } = useSidebarContext()
  return (
    <>
      {showBottomNav && (
        <div className="fixed bottom-0 z-30 flex h-16 w-full bg-passes-black">
          {sidebarMainItems
            .filter((navBarItem) => mobileLinks.has(navBarItem.id))
            .map((navBarItem, index) => (
              <Link
                className="flex flex-1 items-center justify-center"
                href={loading || user ? navBarItem.href : "/login"}
                key={`${navBarItem.id}-${index}`}
              >
                <navBarItem.icon
                  className={classNames(
                    activeRoute === navBarItem.id
                      ? " stroke-passes-primary-color stroke-2"
                      : "stroke-white/50",
                    " stroke-2"
                  )}
                />
              </Link>
            ))}
        </div>
      )}
    </>
  )
}
