import { FanWallCommentDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_FAN_WALL_COMMENT = "/fanwall-comment"

export const useFanWallComment = (fanWallCommentId: string) => {
  const { data: fanWallComment } = useSWR(
    fanWallCommentId ? [CACHE_KEY_FAN_WALL_COMMENT, fanWallCommentId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<FanWallCommentDto>) =>
    _mutateManual([CACHE_KEY_FAN_WALL_COMMENT, fanWallCommentId], update, {
      populateCache: (
        update: Partial<FanWallCommentDto>,
        original: FanWallCommentDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    fanWallComment,
    update: mutateManual
  }
}
