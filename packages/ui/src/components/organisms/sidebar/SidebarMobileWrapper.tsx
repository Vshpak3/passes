import { ReactNode, useState } from "react"

import { MobileHeader } from "src/components/molecules/Sidebar/SidebarLayout/MobileHeader"
import { SidebarMobileContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { MobileNavBar } from "./MobileNavBar"

interface Props {
  children: ReactNode
  activeRoute: string
}
export const SidebarMobileWrapper = ({ children, activeRoute }: Props) => {
  const { isTablet } = useWindowSize()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  return (
    <>
      {isTablet ? (
        <>
          <MobileHeader openSidebar={toggleMobileSidebar} />
          <SidebarMobileContainer
            mobileSidebarOpen={mobileSidebarOpen}
            toggleSidebar={toggleMobileSidebar}
          >
            {children}
          </SidebarMobileContainer>
          <MobileNavBar activeRoute={activeRoute} />
        </>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
