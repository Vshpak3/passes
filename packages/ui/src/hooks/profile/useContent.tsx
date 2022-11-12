import { ContentDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

export const CACHE_KEY_CONTENT = "/content"

export const useContent = (contentId: string) => {
  const { data: content } = useSWR(
    contentId ? [CACHE_KEY_CONTENT, contentId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<ContentDto>) =>
    _mutateManual([CACHE_KEY_CONTENT, contentId], update, {
      populateCache: (
        update: Partial<ContentDto>,
        original: ContentDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    content,
    update: mutateManual
  }
}
