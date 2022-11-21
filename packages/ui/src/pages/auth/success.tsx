import { useRouter } from "next/router"
import { FC, useEffect } from "react"

import { authRouter } from "src/helpers/authRouter"
import { queryParam } from "src/helpers/query"
import { useAuthEvent } from "src/hooks/useAuthEvent"
import { useSafeRouter } from "src/hooks/useSafeRouter"

const AuthSuccess: FC = () => {
  const router = useRouter()
  const { auth } = useAuthEvent()
  const { safePush } = useSafeRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    auth(
      async () => {
        return {
          accessToken: queryParam(router.query.accessToken) as string,
          refreshToken: queryParam(router.query.refreshToken) as string
        }
      },
      async () => undefined,
      async (token: string) => {
        authRouter(safePush, token)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <div className="h-screen w-screen bg-black" />
}

export default AuthSuccess // no WithNormalPageLayout
