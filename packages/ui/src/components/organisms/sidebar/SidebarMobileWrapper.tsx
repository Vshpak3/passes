import { FC, PropsWithChildren, useState } from "react"

import { MobileNavbar } from "src/components/molecules/Sidebar/SidebarLayout/MobileNavbar"
import { SidebarMobileContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer"
// import { useWindowSize } from "src/hooks/useWindowSizeHook"

export const SidebarMobileWrapper: FC<PropsWithChildren> = ({ children }) => {
  // const { isTablet } = useWindowSize()
  const isTablet = false

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  return (
    <>
      {isTablet ? (
        <>
          <MobileNavbar openSidebar={toggleMobileSidebar} />
          <SidebarMobileContainer
            mobileSidebarOpen={mobileSidebarOpen}
            toggleSidebar={toggleMobileSidebar}
          >
            {children}
          </SidebarMobileContainer>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
