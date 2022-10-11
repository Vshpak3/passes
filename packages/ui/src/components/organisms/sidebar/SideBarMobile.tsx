import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import { FC, useState } from "react"
import { MobileNavbar } from "src/components/molecules/Sidebar/SidebarLayout/MobileNavbar"
import { SidebarMobileContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer"
import {
  SidebarMobileDropdown,
  SidebarMobileItem
} from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileItems"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { SidebarNavigation } from "src/layout/Sidebar/sidebarData"

interface SidebarMobileProps {
  active: any
  navigation: SidebarNavigation[]
  setActive: any
  router: any
}

export const SidebarMobile: FC<SidebarMobileProps> = ({
  active,
  navigation,
  setActive,
  router
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const toggleSidebar = () => setMobileSidebarOpen((s) => !s)

  const renderSidebarItems = navigation.map((item: SidebarNavigation) => {
    const child = !item.children ? (
      <SidebarMobileItem
        key={item.id}
        item={item}
        active={active}
        setActive={setActive}
      />
    ) : (
      <SidebarMobileDropdown
        key={item.id}
        item={item}
        active={active}
        setActive={setActive}
        router={router}
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
          <SidebarMobileItem
            key={`sidebar-logout`}
            item={{
              name: "Logout",
              id: "logout",
              icon: LogoutIcon,
              href: "/logout"
            }}
            active={false}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setActive={() => {}}
          />
        </AuthWrapper>
      </SidebarMobileContainer>
    </>
  )
}
