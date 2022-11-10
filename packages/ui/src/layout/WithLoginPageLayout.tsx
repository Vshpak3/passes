import { useRouter } from "next/router"
import { FC, forwardRef, PropsWithChildren, useEffect, useState } from "react"

import { authRouter } from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"
import { IntercomWrapper } from "./IntercomWrapper"

interface LoginWrapperProps {
  routeOnlyIfAuth?: boolean
}

const LoginWrapper: FC<PropsWithChildren<LoginWrapperProps>> = ({
  children,
  routeOnlyIfAuth
}) => {
  const [ready, setReady] = useState(false)
  const { userClaims } = useUser()
  const router = useRouter()
  const { safePush } = useSafeRouter()

  useEffect(() => {
    if (router.isReady) {
      const redirected = authRouter(safePush, userClaims, routeOnlyIfAuth)
      setReady(!redirected)
    }
    // This is intended to only run on page load to ensure direction from page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <>{ready ? children : <div className="h-screen bg-black" />}</>
}

export const WithLoginPageLayout = (
  Page: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: LoginWrapperProps = {}
) => {
  // eslint-disable-next-line react/no-multi-comp
  const WithLoginPageLayout = forwardRef((props, ref) => (
    <LoginWrapper routeOnlyIfAuth={options.routeOnlyIfAuth}>
      <IntercomWrapper>
        <Page {...props} ref={ref} />
      </IntercomWrapper>
    </LoginWrapper>
  ))

  WithLoginPageLayout.displayName = `WithLoginPageLayout(${getComponentName(
    Page
  )})`
  return WithLoginPageLayout
}

function getComponentName(target: FC) {
  return isProd ? "Component" : target.displayName || target.name
}
