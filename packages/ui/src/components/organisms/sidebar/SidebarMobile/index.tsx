import React, { useState } from "react"
import { SidebarComponents as SB } from "src/components/molecules"

import AuthWrapper from "../../../wrappers/AuthWrapper"
import ConditionalWrap from "../../../wrappers/ConditionalWrap"
import CreatorOnlyWrapper from "../../../wrappers/CreatorOnly"

const SidebarMobile = ({
  active,
  navigation,
  setActive,
  router,
  handleLogout
}: any) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const toggleSidebar = () => setMobileSidebarOpen((s) => !s)

  const renderSidebarItems = navigation.map((item: any) => {
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
      <ConditionalWrap
        key={`sidebar-${item.id}`}
        if={item.creatorOnly}
        wrapper={CreatorOnlyWrapper}
      >
        <ConditionalWrap
          if={item.authOnly && !item.creatorOnly}
          wrapper={AuthWrapper}
        >
          {child}
        </ConditionalWrap>
      </ConditionalWrap>
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
