import React, { Fragment, useState } from "react"
import { SidebarComponents as SB } from "src/components/molecules"

const SidebarMobile = ({
  active,
  navigation,
  setActive,
  router,
  handleLogout
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const toggleSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen)

  const renderSidebarItems = navigation.map((item) =>
    !item.children ? (
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
  )

  return (
    <>
      <SB.MobileNavbar openSidebar={toggleSidebar} />
      <SB.SidebarMobileContainer
        mobileSidebarOpen={mobileSidebarOpen}
        toggleSidebar={toggleSidebar}
      >
        {renderSidebarItems}
        <SB.MobileLogoutButton handleLogout={handleLogout} />
      </SB.SidebarMobileContainer>
    </>
  )
}

export default SidebarMobile
