import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import PassesLogoWhite from "public/icons/white-passes-logo.svg"
import { FC } from "react"

import { BecomeCreatorButton } from "src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton"
import { NewPostButton } from "src/components/molecules/Sidebar/SidebarButtons/NewPostButton"
import { SidebarDropdown } from "src/components/molecules/Sidebar/SidebarLayout/SidebarDropdown"
import { SidebarItem } from "src/components/molecules/Sidebar/SidebarLayout/SidebarItems"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isOver18 } from "src/helpers/isOver18"
import { useUser } from "src/hooks/useUser"

interface SidebarProps {
  navigation: SidebarNavigation[]
  active: string
}

export const SidebarCore: FC<SidebarProps> = ({ navigation, active }) => {
  const { user } = useUser()

  return (
    <header className="col-span-3 h-screen w-full items-end border-r-[0.5px] border-gray-600 md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col">
      <div className="flex w-full flex-1 flex-col bg-passes-black px-6 lg:px-2">
        <div className="flex flex-1 flex-col items-end justify-between overflow-y-auto py-6 pr-6 lg:pr-8">
          <div>
            <div className="justify-left items-left flex flex-shrink-0">
              <div>
                <PassesLogoWhite className="ml-8 mt-2 block h-[30x] w-[30px] fill-current" />
              </div>
            </div>
            <nav className="flex flex-col items-start gap-0 pt-[35px]">
              {navigation.map((item: SidebarNavigation) => (
                <AuthWrapper
                  creatorOnly={item.creatorOnly !== false}
                  key={`sidebar-${item.id}`}
                  skipAuth={item.showWithoutAuth}
                >
                  {!item.children ? (
                    <SidebarItem
                      isActive={item.id === active}
                      isDropdown={false}
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
                  <NewPostButton />
                ) : isOver18(user) ? (
                  <BecomeCreatorButton />
                ) : null}
              </AuthWrapper>
            </nav>
          </div>
          <AuthWrapper>
            <div className="flex flex-col items-start gap-0">
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
            </div>
          </AuthWrapper>
        </div>
      </div>
    </header>
  )
}
