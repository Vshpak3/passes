import { PassApi } from "@passes/api-client"
import { useUser } from "src/hooks"
import useSWR from "swr"

import { wrapApi } from "../helpers/wrapApi"
const usePasses = (creatorId = "") => {
  const { user } = useUser()
  const { data: creatorPasses, isValidating: isLoadingCreatorPasses } = useSWR(
    user ? ["/pass/created/", creatorId] : null,
    async () => {
      if (user) {
        const api = wrapApi(PassApi)
        return (
          await api.passGetCreatorPasses({
            creatorId
          })
        ).passes
      }
    }
  )

  const { data: fanPasses, isValidating: isLoadingFanPasses } = useSWR(
    user ? "/pass/owned" : null,
    async () => {
      const api = wrapApi(PassApi)
      return (
        await api.passGetOwnedPasses({
          creatorId: ""
        })
      ).passes
    }
  )

  return {
    creatorPasses,
    fanPasses,
    isLoadingFanPasses,
    isLoadingCreatorPasses
  }
}

export default usePasses
