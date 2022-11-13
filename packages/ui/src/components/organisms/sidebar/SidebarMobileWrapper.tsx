import Router from "next/router"
import { FC, PropsWithChildren, useState } from "react"

import { MobileHeader } from "src/components/molecules/Sidebar/SidebarLayout/MobileHeader"
import { SidebarMobileContainer } from "src/components/molecules/Sidebar/SidebarLayout/SidebarMobileContainer"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { MobileNavBar } from "./MobileNavBar"

interface SidebarMobileWrapperProps {
  activeRoute: string
}
export const SidebarMobileWrapper: FC<
  PropsWithChildren<SidebarMobileWrapperProps>
> = ({ children, activeRoute }) => {
  const { isTablet } = useWindowSize()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen)
  }

  Router.events.on("routeChangeStart", () => setMobileSidebarOpen(false))

  if (isTablet === undefined) {
    return null
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
        <header className="sticky inset-y-0 col-span-3 flex shrink-0 flex-col border-r-[1px] border-passes-gray">
          {children}
        </header>
      )}
    </>
  )
}
