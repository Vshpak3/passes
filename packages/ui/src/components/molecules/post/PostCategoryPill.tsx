import { PostCategoryDto } from "@passes/api-client"
import { FC } from "react"

import { Button } from "src/components/atoms/button/Button"

interface PostCateogryPillProps {
  postCategory?: PostCategoryDto
  onClick: (postCategoryId?: string) => void
  count?: number
}

export const PostCategoryPill: FC<PostCateogryPillProps> = ({
  postCategory,
  onClick,
  count
}: PostCateogryPillProps) => {
  return (
    <Button onClick={() => onClick(postCategory?.postCategoryId)}>
      {postCategory?.name ?? "All"} {count !== undefined && count}
    </Button>
  )
}
