import { PostCategoryDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePostCategory } from "src/hooks/entities/usePostCategory"
import { PostCategory } from "./PostCategory"

export interface PostCategoryCachedProps {
  postCategory: PostCategoryDto
  selected?: boolean
  onSelect?: (selected: boolean) => void
  onDelete?: (postCategoryId: string) => void
}

export const PostCategoryCached: FC<PostCategoryCachedProps> = ({
  postCategory,
  ...res
}: PostCategoryCachedProps) => {
  const { postCategory: cachedPostCategory, update } = usePostCategory(
    postCategory.postCategoryId
  )

  useEffect(() => {
    if (!cachedPostCategory) {
      update(postCategory)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postCategory])

  return (
    <PostCategory postCategory={cachedPostCategory ?? postCategory} {...res} />
  )
}
