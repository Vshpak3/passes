import { useRouter } from "next/router"
import { FC, PropsWithChildren } from "react"
import { useIntercom } from "react-use-intercom"

import { AuthStates, authStateToRoute } from "src/helpers/authRouter"

export const IntercomWrapper: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const { hardShutdown } = useIntercom()

  router.events.on("routeChangeStart", (path: string) => {
    if (path === authStateToRoute(AuthStates.AUTHED)) {
      hardShutdown()
    }
  })

  return <>{children}</>
}
