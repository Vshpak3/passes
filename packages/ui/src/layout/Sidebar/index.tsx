import { useRouter } from "next/router"
import ProfileIcon from "public/icons/profile-edit-icon.svg"
import { memo, useEffect, useState } from "react"
import { SidebarDefault, SidebarMobile } from "src/components/organisms"
import { useUser } from "src/hooks"

import { collapsedNavigation, navigation as _navigation } from "./sidebarData"

const Sidebar = () => {
  const router = useRouter()

  const [hasMounted, setHasMounted] = useState(false)
  const [active, setActive] = useState(router.asPath.split("/").pop())
  const { user } = useUser()
  const [navigation, setNavigation] = useState(_navigation)

  useEffect(() => {
    if (!user || !user.isCreator) {
      setNavigation(_navigation)
      return
    }

    setNavigation([
      ..._navigation,
      {
        id: "profile",
        name: "Profile",
        href: `/${user?.username}`,
        icon: ProfileIcon
      }
    ])
  }, [user])

  // TODO: replace with owns a profile endpoint
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // TODO: sidebar open will be used for mobile sidebar
  const [collapsedAdditionalSidebarOpen, setCollapsedAdditionalSidebarOpen] =
    useState(false)

  const openCollapsedAdditionalSidebar = (tab: any) => {
    setActive(tab)
    setCollapsedAdditionalSidebarOpen(true)
  }

  const closeCollapsedAdditionalSidebar = () => {
    setActive("")
    setCollapsedAdditionalSidebarOpen(false)
  }

  if (!hasMounted) {
    return null
  }

  return (
    <>
      <SidebarDefault
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
        active={active}
        navigation={navigation}
        setActive={setActive}
        router={router}
      />
    </>
  )
}
export default memo(Sidebar)
