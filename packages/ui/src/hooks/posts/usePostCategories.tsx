import { PostApi, PostCategoryDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

const CACHE_KEY_POST_CATEGORIES = "/post-categories"

const api = new PostApi()
export const usePostCategories = (userId?: string) => {
  const { data: postCategories, mutate } = useSWR<PostCategoryDto[]>(
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

  const reorder = async (
    oldOrder: PostCategoryDto[],
    newOrder: PostCategoryDto[]
  ) => {
    try {
      setManual(newOrder)
      await api.reorderPostCategories({
        reorderPostCategoriesRequestDto: {
          postCategoryIds: newOrder.map(
            (postCategory) => postCategory.postCategoryId
          )
        }
      })
      return true
    } catch (err) {
      setManual(oldOrder)
      errorMessage(err, true)
      mutate()
      return false
    }
  }

  const addCategory = async (name: string) => {
    try {
      const id = await api.createPostCategory({
        createPostCategoryRequestDto: {
          name,
          order: postCategories?.length ?? 0
        }
      })
      addManual({
        ...id,
        name,
        order: (postCategories?.length ?? -1) + 1,
        count: 0
      })
      return true
    } catch (err) {
      errorMessage(err, true)
      mutate()
      return false
    }
  }

  const deleteCategory = async (postCategoryId: string) => {
    try {
      await api.deletePostCategory({
        deletePostCategoryRequestDto: { postCategoryId }
      })
      setManual(
        postCategories?.filter(
          (postCategory) => postCategory.postCategoryId !== postCategoryId
        ) ?? []
      )
      return true
    } catch (err) {
      errorMessage(err, true)
      mutate()
      return false
    }
  }

  return {
    postCategories,
    addCategory,
    deleteCategory,
    reorder
  }
}
