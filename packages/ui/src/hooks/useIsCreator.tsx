import { UserApi } from "@passes/api-client"
import { useEffect } from "react"
import useSWR from "swr"

const api = new UserApi()
const CACHE_KEY_IS_CREATOR = "/is-creator"
export const useIsCreator = (userId: string) => {
  const { data, isValidating, mutate } = useSWR<boolean | undefined>(
    [CACHE_KEY_IS_CREATOR, userId],
    async () => {
      return (await api.isCreator({ userId })).value
    }
  )

  useEffect(() => {
    if (!isValidating && data === undefined) {
      mutate()
    }
  }, [data, isValidating, mutate])

  return {
    isCreator: data
  }
}
