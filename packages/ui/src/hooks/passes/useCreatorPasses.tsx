import { PassApi, PassDto } from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_CREATOR_PINNED_PASSES = "/pass/creator-passes/pinned"

export const useCreatorPinnedPasses = (creatorId: string) => {
  const api = new PassApi()

  const { data: pinnedPasses, mutate: mutatePinnedPasses } = useSWR(
    [CACHE_KEY_CREATOR_PINNED_PASSES, creatorId],
    async () => {
      return (
        await api.getCreatorPasses({
          getPassesRequestDto: { creatorId, pinned: true }
        })
      ).data
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: PassDto[]) =>
    _mutateManual([CACHE_KEY_CREATOR_PINNED_PASSES, creatorId], update, {
      populateCache: (update: PassDto[]) => {
        return update
      },
      revalidate: false
    })

  const pinPass = async (pass: PassDto) => {
    await api.pinPass({ passId: pass.passId })
    pass.pinnedAt = new Date()
    const _pinnedPasses = pinnedPasses || []
    _pinnedPasses.push(pass)
    _pinnedPasses.sort(
      (a, b) => (a.pinnedAt?.getTime() || 0) - (b.pinnedAt?.getTime() || 0)
    )
    mutateManual(_pinnedPasses)
  }

  const unpinPass = async (pass: PassDto) => {
    await api.unpinPass({ passId: pass.passId })
    pass.pinnedAt = null
    if (pinnedPasses) {
      mutateManual(pinnedPasses.filter((p) => p.passId !== pass.passId))
    }
  }

  useEffect(() => {
    if (!pinnedPasses) {
      mutatePinnedPasses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    pinnedPasses: pinnedPasses || [],
    pinPass,
    unpinPass
  }
}
