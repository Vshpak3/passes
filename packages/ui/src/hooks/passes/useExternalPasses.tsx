import { PassApi } from "@passes/api-client"
import { useUser } from "src/hooks/useUser"
import useSWR from "swr"

export const useExternalPasses = () => {
  const { user } = useUser()

  const { data: externalPasses = [], isValidating: isLoadingExternalPasses } =
    useSWR(user ? "/pass/external" : null, async () => {
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
    isLoadingExternalPasses
  }
}
