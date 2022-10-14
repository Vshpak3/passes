import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import ProfileIcon from "public/icons/profile-edit-icon.svg"
import { useEffect, useState } from "react"
import { SidebarDefault } from "src/components/organisms/sidebar/SideBarDefault"
import { SidebarMobile } from "src/components/organisms/sidebar/SideBarMobile"
import { useUser } from "src/hooks/useUser"

import { navigation as _navigation } from "./sidebarData"

const NewPostButton = dynamic(
  () => import("src/components/molecules/Sidebar/SidebarButtons/NewPostButton"),
  { ssr: false }
)

export const Sidebar = () => {
  const router = useRouter()
  const { user } = useUser()
  const [hasMounted, setHasMounted] = useState(false)
  const [navigation, setNavigation] = useState(_navigation)
  const [active, setActive] = useState(router.asPath.split("/").pop() ?? "")

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
  }, [router.asPath, user?.username])

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

  if (!hasMounted) {
    return null
  }

  return (
    <>
      <SidebarDefault
        newPostButton={NewPostButton}
        navigation={navigation}
        active={active}
      />
      <SidebarMobile
        newPostButton={NewPostButton}
        navigation={navigation}
        active={active}
      />
    </>
  )
}
