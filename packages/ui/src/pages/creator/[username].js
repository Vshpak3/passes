import { useRouter } from "next/router"
import { CreatorProfile, Welcome } from "src/components/organisms"
import Menu, { MenuPortal } from "src/components/organisms/Menu"
import { useMounted } from "src/hooks"

const Username = () => {
  const mounted = useMounted()
  const router = useRouter()
  const { username } = router.query

  return (
    <div className="relative h-full w-full">
      <MenuPortal />
      {!mounted || !username ? null : username?.includes("andrea") ? (
        <div className="flex">
          <Menu />
          <div className="grow">
            <CreatorProfile />
          </div>
        </div>
      ) : (
        <div className="flex">
          <Menu />
          <Welcome />
        </div>
      )}
    </div>
  )
}

export default Username
