import { PassApi } from "@passes/api-client"
import useSWR from "swr"

import { useUser } from "src/hooks/useUser"

const CACHE_KEY_PASSES_EXTERNAL = "/pass/external"

export const useExternalPasses = () => {
  const { user } = useUser()

  const { data: externalPasses = [], isValidating: loadingExternalPasses } =
    useSWR(user ? CACHE_KEY_PASSES_EXTERNAL : null, async () => {
      const api = new PassApi()
      return (
        await api.getExternalPasses({
          getPassesRequestDto: {
            creatorId: user?.userId
          }
        })
      ).data
    })

  return {
    externalPasses,
    loadingExternalPasses
  }
}
