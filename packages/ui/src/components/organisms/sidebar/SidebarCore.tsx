import Link from "next/link"
import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import LogoutIcon from "public/icons/sidebar/logout.svg"
import { FC } from "react"

import { BecomeCreatorButton } from "src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton"
import { NewPostButton } from "src/components/molecules/Sidebar/SidebarButtons/NewPostButton"
import { SidebarDropdown } from "src/components/molecules/Sidebar/SidebarLayout/SidebarDropdown"
import { SidebarItem } from "src/components/molecules/Sidebar/SidebarLayout/SidebarItems"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isOverMinCreatorAge } from "src/helpers/isOver18"
import { useUser } from "src/hooks/useUser"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

interface SidebarProps {
  navigation: SidebarNavigation[]
  active: string
}

export const SidebarCore: FC<SidebarProps> = ({ navigation, active }) => {
  const { user } = useUser()
  const { isTablet } = useWindowSize()

  return (
    <div className="flex h-full w-full flex-1 flex-col bg-passes-black lg:px-0">
      <div className="safe-h-screen min-safe-h-screen max-safe-h-screen flex flex-1 flex-col items-end justify-between py-6 pr-6 lg:pr-8">
        <div className="flex h-full min-w-[152px] flex-col justify-between">
          <div>
            <div className="flex shrink-0">
              <Link className="select-none outline-none" href="/home">
                <PassesLogoPink className="mt-2 block h-[30x] w-[30px] fill-current" />
              </Link>
            </div>
            <nav className="flex flex-col items-start gap-0 pt-10">
              {navigation.map((item: SidebarNavigation) => (
                <AuthWrapper
                  creatorOnly={item.creatorOnly !== false}
                  key={`sidebar-${item.id}`}
                  skipAuth={item.showWithoutAuth}
                >
                  {!item.children ? (
                    <SidebarItem
                      isActive={item.id === active}
                      item={item}
                      key={`sidebar-${item.id}`}
                    />
                  ) : (
                    <SidebarDropdown
                      active={active}
                      item={item}
                      key={`sidebar-${item.id}`}
                    />
                  )}
                </AuthWrapper>
              ))}
              <AuthWrapper>
                {user?.isCreator ? (
                  <NewPostButton isTablet={isTablet} />
                ) : isOverMinCreatorAge(user) ? (
                  <BecomeCreatorButton isTablet={isTablet} />
                ) : null}
              </AuthWrapper>
            </nav>
          </div>
          <div className="flex pr-4 lg:justify-end">
            <AuthWrapper>
              <SidebarItem
                isActive={false}
                isDropdown={false}
                item={{
                  name: "Logout",
                  id: "logout",
                  icon: LogoutIcon,
                  href: "/logout"
                }}
                key="sidebar-logout"
              />
            </AuthWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
