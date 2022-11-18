import { PostApi, PostCategoryDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

const CACHE_KEY_POST_CATEGORIES = "/post-categories"

const api = new PostApi()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usePostCategories = (userId?: string) => {
  const { data: postCategories } = useSWR<PostCategoryDto[]>(
    userId ? [CACHE_KEY_POST_CATEGORIES, userId] : null,
    async () => {
      return (
        await api.getPostCategories({
          getPostCategoriesRequestDto: { userId: userId ?? "" }
        })
      ).postCategories
    },
    { revalidateOnMount: true }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const setManual = (update: PostCategoryDto[]) =>
    _mutateManual([CACHE_KEY_POST_CATEGORIES, userId], update, {
      populateCache: (update: PostCategoryDto[]) => {
        return update
      },
      revalidate: false
    })
  const addManual = (update: PostCategoryDto) =>
    _mutateManual([CACHE_KEY_POST_CATEGORIES, userId], update, {
      populateCache: (
        update: PostCategoryDto[],
        original: PostCategoryDto[] | undefined
      ) => {
        return [...(original ?? []), update]
      },
      revalidate: false
    })
  const reorder = async (newOrder: PostCategoryDto[]) => {
    try {
      await api.reorderPostCategories({
        reorderPostCategoriesRequestDto: {
          postCategoryIds: newOrder.map(
            (postCategory) => postCategory.postCategoryId
          )
        }
      })
      setManual(newOrder)
    } catch (err) {
      errorMessage(err)
    }
  }

  const addCategory = async (name: string) => {
    try {
      const id = await api.createPostCategory({
        createPostCategoryRequestDto: { name }
      })
      addManual({
        ...id,
        name,
        order: (postCategories?.length ?? -1) + 1
      })
    } catch (err) {
      errorMessage(err)
    }
  }

  const deleteCategory = async (postCategoryId: string, order: number) => {
    try {
      await api.deletePostCategory({
        deletePostCategoryRequestDto: { postCategoryId, order }
      })
      setManual(
        postCategories?.filter(
          (postCategory) => postCategory.postCategoryId !== postCategoryId
        ) ?? []
      )
    } catch (err) {
      errorMessage(err)
    }
  }

  return {
    postCategories,
    addCategory,
    deleteCategory,
    reorder
  }
}
