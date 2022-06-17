import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import CreatorProfile from "src/containers/creator-profile"
import Menu, { MenuPortal } from "src/containers/menu"
import Welcome from "src/containers/welcome"
import useMounted from "src/hooks/use-mounted"

const Username = () => {
  const { data: session } = useSession()
  const mounted = useMounted()
  const router = useRouter()
  const { username } = router.query

  useEffect(() => {
    if (session === null) {
      router.push("/")
    }
  }, [session])

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
