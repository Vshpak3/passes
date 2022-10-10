import { useRouter } from "next/router"
import React, { FC, PropsWithChildren, useEffect, useState } from "react"
import { authRouter } from "src/helpers/authRouter"
import { isProd } from "src/helpers/env"
import { useUser } from "src/hooks"

interface LoginWrapperProps {
  routeOnlyIfAuth?: boolean
}

const LoginWrapper: FC<PropsWithChildren<LoginWrapperProps>> = ({
  children,
  routeOnlyIfAuth
}) => {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const { userClaims } = useUser()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const redirected = authRouter(router, userClaims, routeOnlyIfAuth)

    setReady(!redirected)
  }, [router, userClaims, routeOnlyIfAuth])

  return <>{ready ? children : <></>}</>
}

export const WithLoginPageLayout = (
  Page: any,
  options: LoginWrapperProps = {}
) => {
  const WithLoginPageLayout = React.forwardRef((props, ref) => (
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
