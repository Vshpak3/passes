import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import { FC, useState } from "react"
import { BecomeCreatorButton } from "src/components/molecules/Sidebar/SidebarButtons/BecomeCreatorButton"
import { MobileNavbar } from "src/components/molecules/Sidebar/SidebarLayout/MobileNavbar"
import { SidebarMobileContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer"
import {
  SidebarMobileDropdown,
  SidebarMobileItem
} from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileItems"
import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { isOver18 } from "src/helpers/isOver18"
import { useUser } from "src/hooks/useUser"

import { SidebarDefaultProps } from "./Types"

export const SidebarMobile: FC<SidebarDefaultProps> = ({
  active,
  navigation
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { user } = useUser()
  const toggleSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  const renderSidebarItems = navigation.map((item: SidebarNavigation) => {
    const child = !item.children ? (
      <SidebarMobileItem
        onClick={toggleSidebar}
        key={item.id}
        item={item}
        active={active}
      />
    ) : (
      <SidebarMobileDropdown
        onClick={toggleSidebar}
        key={item.id}
        item={item}
        active={active}
      />
    )

    return (
      <AuthWrapper
        key={`sidebar-${item.id}`}
        skipAuth={item.showWithoutAuth}
        creatorOnly={item.creatorOnly !== false}
      >
        {child}
      </AuthWrapper>
    )
  })

  return (
    <>
      <MobileNavbar openSidebar={toggleSidebar} />
      <SidebarMobileContainer
        mobileSidebarOpen={mobileSidebarOpen}
        toggleSidebar={toggleSidebar}
      >
        {renderSidebarItems}
        <AuthWrapper>
          {isOver18(user) ? (
            <BecomeCreatorButton
              isMobile
              close={() => {
                setMobileSidebarOpen(false)
              }}
            />
          ) : null}
        </AuthWrapper>
        <AuthWrapper>
          <SidebarMobileItem
            onClick={toggleSidebar}
            key={`sidebar-logout`}
            item={{
              name: "Logout",
              id: "logout",
              icon: LogoutIcon,
              href: "/logout"
            }}
            active=""
          />
        </AuthWrapper>
      </SidebarMobileContainer>
    </>
  )
}
