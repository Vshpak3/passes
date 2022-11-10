import { useRouter } from "next/router"
import { FC, PropsWithChildren } from "react"
import { IntercomProvider, useIntercom } from "react-use-intercom"

import { AuthStates, authStateToRoute } from "src/helpers/authRouter"

export const IntercomWrapper: FC<PropsWithChildren> = ({ children }) => (
  <IntercomProvider
    appId={process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? ""}
    autoBoot
  >
    <IntercomInner>{children}</IntercomInner>
  </IntercomProvider>
)

// Ensures we remove intercom once we finish login/signup
// eslint-disable-next-line react/no-multi-comp
const IntercomInner: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const { hardShutdown } = useIntercom()

  router.events.on("routeChangeStart", (path: string) => {
    if (path === authStateToRoute(AuthStates.AUTHED)) {
      hardShutdown()
    }
  })

  return <>{children}</>
}
