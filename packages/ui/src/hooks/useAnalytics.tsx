import {
  CreatorEarningDto,
  CreatorEarningDtoCategoryEnum,
  CreatorStatsApi
} from "@passes/api-client"
import ms from "ms"
import useSWR from "swr"

const CACHE_KEY_BALANCE = "/creator-stats/balance"

type BalanceType = Record<CreatorEarningDtoCategoryEnum, CreatorEarningDto>
export const useCreatorBalance = () => {
  const api = new CreatorStatsApi()

  const { data: userBalance } = useSWR<BalanceType>(
    CACHE_KEY_BALANCE,
    async () => {
      return (await api.getAvailableBalance()).earnings as BalanceType
    },
    { revalidateOnMount: true, refreshInterval: ms("3 seconds") }
  )
  console.log(userBalance)

  return { userBalance }
}
