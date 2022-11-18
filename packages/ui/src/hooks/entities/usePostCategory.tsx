import { PostApi, PostCategoryDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

const CACHE_KEY_POST_CATEGORY = "/post-category"

const api = new PostApi()
export const usePostCategory = (postCategoryId: string) => {
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

  const editCategory = async (name: string) => {
    try {
      await api.editPostCategory({
        editPostCategoryRequestDto: { postCategoryId, name }
      })
      mutateManual({ name })
      return true
    } catch (err) {
      errorMessage(err, true)
      return false
    }
  }

  return {
    postCategory,
    update: mutateManual,
    editCategory
  }
}
