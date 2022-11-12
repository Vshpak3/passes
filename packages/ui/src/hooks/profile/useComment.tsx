import { CommentDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_COMMENT = "/comment"

export const useComment = (commentId: string) => {
  // TODO: add refresh interval passed on a "ready" tag for when content is finished uploading
  const { data: comment } = useSWR(
    commentId ? [CACHE_KEY_COMMENT, commentId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<CommentDto>) =>
    _mutateManual([CACHE_KEY_COMMENT, commentId], update, {
      populateCache: (
        update: Partial<CommentDto>,
        original: CommentDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    comment,
    update: mutateManual
  }
}
