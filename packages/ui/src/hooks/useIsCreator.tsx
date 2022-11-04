import { UserApi } from "@passes/api-client"
import { useEffect } from "react"
import useSWR from "swr"

const api = new UserApi()
const CACHE_KEY_IS_CREATOR = "/is-creator"
export const useIsCreator = (userId?: string) => {
  const { data, error, isValidating, mutate } = useSWR<boolean | undefined>(
    userId ? [CACHE_KEY_IS_CREATOR, userId] : null,
    async () => {
      return (await api.isCreator({ userId: userId ?? "" })).value
    }
  )

  useEffect(() => {
    if (!isValidating && data === undefined && !error) {
      mutate()
    }
  }, [data, error, isValidating, mutate])

  return {
    isCreator: data
  }
}
