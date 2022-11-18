import { PostCategoryDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_POST_CATEGORY = "/post-category"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usePostCategory = (postCategoryId: string) => {
  const { data: postCategory } = useSWR(
    postCategoryId ? [CACHE_KEY_POST_CATEGORY, postCategoryId] : null,
    async () => null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<PostCategoryDto>) =>
    _mutateManual([CACHE_KEY_POST_CATEGORY, postCategoryId], update, {
      populateCache: (
        update: Partial<PostCategoryDto>,
        original: PostCategoryDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    postCategory,
    update: mutateManual
  }
}
