import { CreatorStatsApi } from "@passes/api-client"
import ms from "ms"
import useSWR from "swr"

const api = new CreatorStatsApi()
const CACHE_KEY_USER_SPENDING = "/user-spending"

export const useUserSpending = (isCreator: boolean, userId?: string) => {
  const { data: amount } = useSWR<number>(
    userId && isCreator ? [CACHE_KEY_USER_SPENDING, userId] : null,
    async () => {
      return (
        await api.getUserSpending({
          getUserSpendingRequestDto: { userId: userId ?? "" }
        })
      ).amount
    },
    { refreshInterval: ms("1 second"), revalidateOnMount: true }
  )

  return {
    amount
  }
}
