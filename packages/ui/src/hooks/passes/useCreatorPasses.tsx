import { PassApi, PassDto } from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_CREATOR_PINNED_PASSES = "/pass/creator-passes/pinned"
const CACHE_KEY_CREATOR_PASSES = "/pass/creator-passes"

export const useCreatorPasses = (creatorId?: string) => {
  const api = new PassApi()

  const { data: pinnedPasses, mutate: mutatePinnedPasses } = useSWR(
    creatorId ? [CACHE_KEY_CREATOR_PINNED_PASSES, creatorId] : null,
    async () => {
      return (
        await api.getCreatorPasses({
          getPassesRequestDto: { creatorId, pinned: true }
        })
      ).data
    },
    { revalidateOnMount: true }
  )

  // Note, this does not retrieve immediately
  const { data: passes, mutate: mutatePasses } = useSWR(
    creatorId ? [CACHE_KEY_CREATOR_PASSES, creatorId] : null,
    async () => {
      return (
        await api.getCreatorPasses({
          getPassesRequestDto: { creatorId }
        })
      ).data
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: PassDto[]) =>
    _mutateManual(
      creatorId ? [CACHE_KEY_CREATOR_PINNED_PASSES, creatorId] : null,
      update,
      {
        populateCache: (update: PassDto[]) => {
          return update
        },
        // Set true to force passes feed component to render
        revalidate: true
      }
    )

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
    unpinPass,
    passes,
    mutatePasses
  }
}
