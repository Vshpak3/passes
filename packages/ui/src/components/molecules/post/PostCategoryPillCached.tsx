import { PostCategoryDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { usePostCategory } from "src/hooks/entities/usePostCategory"
import { PostCategoryPill } from "./PostCategoryPill"

export interface PostCategoryPillCachedProps {
  postCategory: PostCategoryDto
  onClick: (postCategoryId?: string) => void
  showCount: boolean
  selected: boolean
}

export const PostCategoryPillCached: FC<PostCategoryPillCachedProps> = ({
  postCategory,
  ...res
}: PostCategoryPillCachedProps) => {
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
    <PostCategoryPill
      postCategory={cachedPostCategory ?? postCategory}
      {...res}
    />
  )
}
