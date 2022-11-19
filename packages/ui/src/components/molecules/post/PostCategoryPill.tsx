import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"
import { PostCategoryPillCachedProps } from "./PostCategoryPillCached"

type PostCategoryPillProps = PostCategoryPillCachedProps

export const PostCategoryPill: FC<PostCategoryPillProps> = ({
  postCategory,
  onClick,
  showCount,
  selected
}: PostCategoryPillProps) => {
  return (
    <Button
      onClick={() =>
        onClick(selected ? undefined : postCategory?.postCategoryId)
      }
    >
      {postCategory.name} {showCount && postCategory.count}
    </Button>
  )
}
