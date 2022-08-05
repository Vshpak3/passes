import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Welcome } from "src/components/organisms"
import Menu, { MenuPortal } from "src/components/organisms/Menu"

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
