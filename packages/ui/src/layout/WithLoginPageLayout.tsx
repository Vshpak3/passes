import { AuthApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, forwardRef, PropsWithChildren, useEffect, useState } from "react"

import { authRouter } from "src/helpers/authRouter"
import { useSafeRouter } from "src/hooks/useSafeRouter"
import { useUser } from "src/hooks/useUser"
import { IntercomWrapper } from "./IntercomWrapper"
import { getComponentName } from "./WithNormalPageLayout"

const REFRESH_MAX_SECONDS = 10

interface LoginWrapperProps {
  routeOnTokenChange?: boolean
  routeOnlyIfAuth?: boolean
  refreshUnverifiedToken?: boolean
}

const LoginWrapper: FC<PropsWithChildren<LoginWrapperProps>> = ({
  children,
  routeOnTokenChange = true,
  routeOnlyIfAuth = false,
  refreshUnverifiedToken = false
}) => {
  const router = useRouter()
  const { safePush } = useSafeRouter()
  const { accessToken, setAccessToken, userClaims } = useUser()

  const [ready, setReady] = useState(false)
  const [refreshed, setRefreshed] = useState(!refreshUnverifiedToken)
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(1)

  useEffect(() => {
    if (router.isReady && refreshed) {
      const redirected = authRouter(safePush, userClaims, routeOnlyIfAuth)
      setReady(!redirected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, refreshed])

  useEffect(() => {
    if (routeOnTokenChange && accessToken) {
      authRouter(safePush, accessToken)
    }
  }, [accessToken, safePush, routeOnTokenChange])

  // Unverified Refreshing
  // There can be issues if you are mid-authentition (e.g. on the email or signup
  // pages) you continue in another browser/device. This commonly happens if the
  // verificaiton email is opened elsewhere. The below logic accounts for the this
  // situation.

  const _refreshUnverifiedToken = async () => {
    await new AuthApi()
      .refreshUnverified()
      .then((t) => {
        setAccessToken(t.accessToken)
        authRouter(safePush, t.accessToken)
        return t
      })
      .catch((e) => e)
    setRefreshed(true) // only needed for initial call on page load
  }

  useEffect(() => {
    if (!refreshUnverifiedToken) {
      return
    }
    if (!refreshed) {
      _refreshUnverifiedToken()
    }
    const interval = setInterval(async () => {
      await _refreshUnverifiedToken()
      setSecondsSinceRefresh(secondsSinceRefresh + 2)
    }, 1000 * Math.min(secondsSinceRefresh, REFRESH_MAX_SECONDS))

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsSinceRefresh])

  return (
    <>{ready ? children : <div className="h-screen w-screen bg-black" />}</>
  )
}

export const WithLoginPageLayout = (
  Page: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options: LoginWrapperProps = {}
) => {
  // eslint-disable-next-line react/no-multi-comp
  const WithLoginPageLayout = forwardRef((props, ref) => (
    <LoginWrapper
      refreshUnverifiedToken={options.refreshUnverifiedToken}
      routeOnlyIfAuth={options.routeOnlyIfAuth}
    >
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
