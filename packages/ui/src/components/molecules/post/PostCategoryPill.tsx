import { FC } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
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
      className="shrink-0"
      onClick={() =>
        onClick(selected ? undefined : postCategory?.postCategoryId)
      }
      variant={selected ? ButtonVariant.PINK : ButtonVariant.PINK_OUTLINE}
    >
      {postCategory.name} {showCount && postCategory.count}
    </Button>
  )
}
