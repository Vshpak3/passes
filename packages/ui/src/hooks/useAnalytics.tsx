import { CreatorStatsApi } from "@passes/api-client"
import ms from "ms"
import useSWR from "swr"

const CACHE_KEY_BALANCE = "/creator-stats/balance"

export const useCreatorBalance = () => {
  const api = new CreatorStatsApi()

  const { data: userBalance } = useSWR(
    CACHE_KEY_BALANCE,
    async () => {
      return await api.getAvailableBalance()
    },
    { revalidateOnMount: true, refreshInterval: ms("3 seconds") }
  )

  return { userBalance }
}
