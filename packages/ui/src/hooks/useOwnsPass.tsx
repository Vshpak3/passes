import { PassApi } from "@passes/api-client"
import useSWR from "swr"

const CACHE_KEY_PASSHOLDINGS = "passholdings"

export const useOwnsPass = (passId?: string) => {
  const api = new PassApi()

  const { data, isValidating: loading } = useSWR(
    passId ? [CACHE_KEY_PASSHOLDINGS, passId] : null,
    async () => {
      return await api.getPassHoldings({
        getPassHoldingsRequestDto: { order: "desc", passId }
      })
    },
    { revalidateOnMount: true }
  )

  return {
    ownsPass: (data?.data.length ?? 0) > 0,
    loading
  }
}
