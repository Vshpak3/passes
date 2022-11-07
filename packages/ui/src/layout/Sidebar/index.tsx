import { useRouter } from "next/router"
import UserIcon from "public/icons/sidebar/profile.svg"
import { useEffect, useState } from "react"

import { SidebarNavigation } from "src/components/molecules/Sidebar/SidebarLayout/Types"
import { SidebarCore } from "src/components/organisms/sidebar/SidebarCore"
import { SidebarMobileWrapper } from "src/components/organisms/sidebar/SidebarMobileWrapper"
import { useUser } from "src/hooks/useUser"
import { navigation as _navigation } from "./sidebarData"

export const Sidebar = () => {
  const router = useRouter()
  const { user } = useUser()

  const [navigation, setNavigation] = useState<SidebarNavigation[]>([])
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
    const extras = []
    if (user) {
      extras.push({
        id: "profile",
        name: "Profile",
        href: `/${user?.username}`,
        icon: UserIcon,
        creatorOnly: false
      })
    }

    setNavigation([..._navigation, ...extras])
  }, [user])

  return (
    <SidebarMobileWrapper activeRoute={active}>
      <SidebarCore active={active} navigation={navigation} />
    </SidebarMobileWrapper>
  )
}
