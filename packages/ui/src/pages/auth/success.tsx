import { useRouter } from "next/router"
import { FC, useEffect } from "react"

import { queryParam } from "src/helpers/query"
import { useAuthEvent } from "src/hooks/useAuthEvent"

const AuthSuccess: FC = () => {
  const router = useRouter()
  const { auth } = useAuthEvent()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    auth(async () => {
      return {
        accessToken: queryParam(router.query.accessToken) as string,
        refreshToken: queryParam(router.query.refreshToken) as string
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <div className="h-screen w-screen bg-black"></div>
}

export default AuthSuccess // no WithNormalPageLayout
