import { PassApi } from "@passes/api-client"
import { useUser } from "src/hooks/useUser"
import useSWR from "swr"

export const useCreatorPasses = () => {
  const { user } = useUser()

  const { data: creatorPasses = [], isValidating: isLoadingCreatorPasses } =
    useSWR(user ? "/pass/creator-passes" : null, async () => {
      const api = new PassApi()
      return (
        await api.getCreatorPasses({
          getPassesRequestDto: {
            creatorId: user?.userId
          }
        })
      ).data
    })

  return {
    creatorPasses,
    isLoadingCreatorPasses
  }
}
