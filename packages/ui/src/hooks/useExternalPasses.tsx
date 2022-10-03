import { PassApi } from "@passes/api-client"
import { useUser } from "src/hooks"
import useSWR from "swr"

const useExternalPasses = () => {
  const { user } = useUser()

  const { data: externalPasses = [], isValidating: isLoadingExternalPasses } =
    useSWR(user ? "/pass/external" : null, async () => {
      const api = new PassApi()
      return (
        await api.getExternalPasses({
          getExternalPassesRequestDto: {
            creatorId: user?.id
          }
        })
      ).passes
    })

  return {
    externalPasses,
    isLoadingExternalPasses
  }
}

export default useExternalPasses
