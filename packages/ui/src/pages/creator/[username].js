import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { CreatorProfile, Welcome } from "src/components/organisms"
import Menu, { MenuPortal } from "src/components/organisms/Menu"
import { useMounted } from "src/hooks"

const Username = () => {
  const { data: session } = useSession()
  const mounted = useMounted()
  const router = useRouter()
  const { username } = router.query

  useEffect(() => {
    if (session === null) {
      router.push("/")
    }
  }, [router, session])

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
