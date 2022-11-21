import { AccessTokensResponseDto } from "@passes/api-client"
import { useEffect } from "react"
import { toast } from "react-toastify"

import { useUser } from "src/hooks/useUser"

/**
 * Structures any event that modifies access tokens. Input functions:
 *   1) Makes API call and must return access tokens
 *   2) Callback before access tokens are set
 *   3) Callback after access tokens are set
 */
export function useAuthEvent(mutateOnTokenChange = true) {
  const { accessToken, setAccessToken, setRefreshToken, mutate } = useUser()

  useEffect(() => {
    if (mutateOnTokenChange) {
      mutate()
    }
  }, [accessToken, mutate, mutateOnTokenChange])

  const auth = async (
    apiCall: () => Promise<AccessTokensResponseDto>,
    callbackBeforeSet: (token: string) => Promise<void> = async () => undefined,
    callbackAfterSet: (token: string) => Promise<void> = async () => undefined
  ) => {
    const tokens = await apiCall()

    if (!tokens.accessToken) {
      toast.error("Something went wrong, please try again later")
      console.error("Unexpected missing access token")
      return
    }

    await callbackBeforeSet(tokens.accessToken)

    setAccessToken(tokens.accessToken)

    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken)
    }

    await callbackAfterSet(tokens.accessToken)
  }

  return { auth }
}
