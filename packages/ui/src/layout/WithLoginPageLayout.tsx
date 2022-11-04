import { useRouter } from "next/router"
import React, {
  FC,
  forwardRef,
  PropsWithChildren,
  useEffect,
  useState
} from "react"

import { authRouter } from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Page: any,
  options: LoginWrapperProps = {}
) => {
  const WithLoginPageLayout = forwardRef((props, ref) => (
    <LoginWrapper routeOnlyIfAuth={options.routeOnlyIfAuth}>
      <Page {...props} ref={ref} />
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
