import { FC, useState } from "react"
import { SidebarComponents as SB } from "src/components/molecules"
import AuthWrapper from "src/components/wrappers/AuthWrapper"
import { SidebarNavigation } from "src/layout/Sidebar/sidebarData"

interface SidebarMobileProps {
  active: any
  navigation: SidebarNavigation[]
  setActive: any
  router: any
  handleLogout: any
}

const SidebarMobile: FC<SidebarMobileProps> = ({
  active,
  navigation,
  setActive,
  router,
  handleLogout
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const toggleSidebar = () => setMobileSidebarOpen((s) => !s)

  const renderSidebarItems = navigation.map((item: SidebarNavigation) => {
    const child = !item.children ? (
      <SB.SidebarMobileItem
        key={item.id}
        item={item}
        active={active}
        setActive={setActive}
      />
    ) : (
      <SB.SidebarMobileDropdown
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
      <SB.MobileNavbar openSidebar={toggleSidebar} />
      <SB.SidebarMobileContainer
        mobileSidebarOpen={mobileSidebarOpen}
        toggleSidebar={toggleSidebar}
      >
        {renderSidebarItems}
        <AuthWrapper>
          <SB.MobileLogoutButton handleLogout={handleLogout} />
        </AuthWrapper>
      </SB.SidebarMobileContainer>
    </>
  )
}

export default SidebarMobile
