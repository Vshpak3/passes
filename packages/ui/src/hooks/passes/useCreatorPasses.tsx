import { PassApi } from "@passes/api-client"
import { useEffect } from "react"
import { useUser } from "src/hooks/useUser"
import useSWR from "swr"

const CACHE_KEY_CREATOR_PASSES = "/pass/creator-passes"

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useCreatorPasses = () => {
  const { user } = useUser()

  const api = new PassApi()

  const {
    data: passes = [],
    isValidating: isLoadingPasses,
    mutate
  } = useSWR(user ? CACHE_KEY_CREATOR_PASSES : null, async () => {
    return (
      await api.getCreatorPasses({
        getPassesRequestDto: { creatorId: user?.userId }
      })
    ).data
  })

  useEffect(() => {
    if (user && passes.length === 0) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId])

  return {
    passes,
    isLoadingPasses
  }
}
