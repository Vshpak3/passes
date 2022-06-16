import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Welcome from "src/containers/welcome"
import Menu, { MenuPortal } from "src/containers/menu"

const ProfilePage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session === null) {
    router.push("/", "/", { shallow: true })
  }

  return (
    <div className="relative h-full w-full">
      <MenuPortal />
      <div className="flex">
        <Menu />
        <Welcome />
      </div>
    </div>
  )
}

export default ProfilePage
