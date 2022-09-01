import { useRouter } from "next/router"
import { memo, useEffect, useState } from "react"
import { SidebarDefault, SidebarMobile } from "src/components/organisms"

import { useUser } from "../../hooks"
import { collapsedNavigation, navigation } from "./sidebarData"

const Sidebar = () => {
  const router = useRouter()

  const [hasMounted, setHasMounted] = useState(false)
  const [active, setActive] = useState(router.asPath.split("/").pop())
  const { user, logout } = useUser()

  // TODO: replace with owns a profile endpoint
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // TODO: sidebar open will be used for mobile sidebar
  const [collapsedAdditionalSidebarOpen, setCollapsedAdditionalSidebarOpen] =
    useState(false)

  const openCollapsedAdditionalSidebar = (tab) => {
    setActive(tab)
    setCollapsedAdditionalSidebarOpen(true)
  }

  const closeCollapsedAdditionalSidebar = () => {
    setActive("")
    setCollapsedAdditionalSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!hasMounted) {
    return null
  }

  console.log("rendered")

  return (
    <>
      <SidebarDefault
        handleLogout={handleLogout}
        active={active}
        navigation={navigation}
        setActive={setActive}
        router={router}
        user={user}
        collapsedNavigation={collapsedNavigation}
        collapsedAdditionalSidebarOpen={collapsedAdditionalSidebarOpen}
        openCollapsedAdditionalSidebar={openCollapsedAdditionalSidebar}
        closeCollapsedAdditionalSidebar={closeCollapsedAdditionalSidebar}
      />
      <SidebarMobile
        handleLogout={handleLogout}
        active={active}
        navigation={navigation}
        setActive={setActive}
        router={router}
      />
    </>
  )
}
export default memo(Sidebar)
