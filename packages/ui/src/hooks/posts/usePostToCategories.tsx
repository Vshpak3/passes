import { PostApi, PostCategoryDto } from "@passes/api-client"

import { errorMessage } from "src/helpers/error"
import { usePost } from "src/hooks/entities/usePost"

const api = new PostApi()
export const usePostToCategories = (postId: string) => {
  const { update, post } = usePost(postId)
  const addPostToCategory = async (postCategory: PostCategoryDto) => {
    try {
      await api.addPostToCategory({
        postToCategoryRequestDto: {
          postCategoryId: postCategory.postCategoryId,
          postId
        }
      })
      update({
        postCategories: [...(post?.postCategories ?? []), postCategory]
      })
      return true
    } catch (err) {
      errorMessage(err, true)
      return false
    }
  }

  const removePostFromCategory = async (postCategory: PostCategoryDto) => {
    try {
      await api.removePostFromCategory({
        postToCategoryRequestDto: {
          postCategoryId: postCategory.postCategoryId,
          postId
        }
      })
      update({
        postCategories: (post?.postCategories ?? []).filter(
          (prevCategory) =>
            prevCategory.postCategoryId !== postCategory.postCategoryId
        )
      })
      return true
    } catch (err) {
      errorMessage(err, true)
      return false
    }
  }

  return {
    addPostToCategory,
    removePostFromCategory
  }
}
