import { AccessTokensResponseDto } from "@passes/api-client"
import { useEffect } from "react"
import { toast } from "react-toastify"

import { authRouter } from "src/helpers/authRouter"
import { useUser } from "src/hooks/useUser"
import { useSafeRouter } from "./useSafeRouter"

/**
 * Structures any event that modifies access tokens.
 */
export function useAuthEvent(mutateOnTokenChange = true) {
  const { accessToken, setAccessToken, setRefreshToken, mutate } = useUser()
  const { safePush } = useSafeRouter()

  useEffect(() => {
    if (mutateOnTokenChange) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  const auth = async (
    apiCall: () => Promise<AccessTokensResponseDto>,
    callback: (token: string) => Promise<void> = async () => undefined,
    route = true
  ) => {
    const tokens = await apiCall()

    if (!tokens.accessToken) {
      toast.error("Something went wrong, please try again later")
      console.error("Unexpected missing access token")
      return false
    }
    setAccessToken(tokens.accessToken)

    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken)
    }

    await callback(tokens.accessToken)

    if (route) {
      authRouter(safePush, tokens.accessToken)
    }
  }

  return { auth }
}
