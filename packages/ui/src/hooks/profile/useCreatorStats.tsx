import { CreatorStatsApi, GetCreatorStatsResponseDto } from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_CREATOR_STATS = "/creator/stats"

export interface CreatorStatsUpdate {
  field: keyof Omit<GetCreatorStatsResponseDto, "userId">
  event: "increment" | "decrement"
}

export const useCreatorStats = (userId?: string) => {
  const api = new CreatorStatsApi()

  const {
    data: creatorStats,
    isValidating: loadingCreatorStats,
    mutate: mutateCreatorStats
  } = useSWR(userId ? [CACHE_KEY_CREATOR_STATS, userId] : null, async () => {
    return await api.getCreatorStats({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      creatorId: userId!
    })
  })
  useEffect(() => {
    if (userId && !creatorStats) {
      mutateCreatorStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, mutateCreatorStats])

  const { mutate: _mutateManualCreatorStats } = useSWRConfig()
  const mutateManualCreatorStats = (update: CreatorStatsUpdate) =>
    _mutateManualCreatorStats([CACHE_KEY_CREATOR_STATS, userId], update, {
      populateCache: (
        update: CreatorStatsUpdate,
        original: GetCreatorStatsResponseDto
      ) => {
        return Object.assign(original, {
          [update.field]:
            (original[update.field] || 0) +
            (update.event === "increment" ? 1 : -1)
        })
      },
      revalidate: false
    })

  return {
    creatorStats,
    loadingCreatorStats,
    mutateCreatorStats,
    mutateManualCreatorStats
  }
}
