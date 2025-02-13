import { useRouter } from "next/router"
import HomeIcon from "public/icons/sidebar/home.svg"
import LoginIcon from "public/icons/sidebar/login.svg"
import { useEffect, useState } from "react"

import { SidebarCore } from "src/components/organisms/sidebar/SidebarCore"
import { SidebarMobileWrapper } from "src/components/organisms/sidebar/SidebarMobileWrapper"
import { useUser } from "src/hooks/useUser"
import { sidebarMainItems } from "./sidebarData"

export const Sidebar = () => {
  const router = useRouter()
  const { user, loading } = useUser()

  const [navigation, setNavigation] = useState(sidebarMainItems)
  const [active, setActive] = useState(router.asPath.split("/").pop() ?? "home")

  useEffect(() => {
    const pathSegments = router.asPath.split("/").filter((seg) => !!seg)
    const activeTab = pathSegments.length
      ? pathSegments[pathSegments.length - 1]
      : ""
    // [username] is the dynamic route for the "Profile" sidebar button
    if (activeTab === user?.username) {
      setActive("profile")
      // Settings has sub-routes but no dropdown
    } else if (pathSegments[0] === "settings") {
      setActive("settings")
    } else {
      setActive(activeTab)
    }
  }, [router.asPath, user])

  useEffect(() => {
    // Update the profile href once the sidebar loads
    setNavigation((nav) =>
      nav.map((n) => {
        if (n.id === "profile") {
          n.href = `/${user?.username}`
        } else if (n.id === "home") {
          n.name = loading || !!user ? "Home" : "Login"
          n.href = loading || !!user ? "/home" : "/login"
          n.icon = loading || !!user ? HomeIcon : LoginIcon
        }
        return n
      })
    )
  }, [loading, user])

  return (
    <SidebarMobileWrapper activeRoute={active}>
      <SidebarCore active={active} navigation={navigation} />
    </SidebarMobileWrapper>
  )
}
