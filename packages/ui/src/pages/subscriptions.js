import { Welcome } from "src/components/organisms"
import Menu, { MenuPortal } from "src/components/organisms/Menu"

const ProfilePage = () => {
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
