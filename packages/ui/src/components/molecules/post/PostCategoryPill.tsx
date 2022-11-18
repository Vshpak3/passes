import { PostCategoryDto } from "@passes/api-client"
import { FC } from "react"

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
    <div
      className="rounded-[20px] bg-passes-pink-100 px-4 py-2"
      onClick={() => onClick(postCategory?.postCategoryId)}
    >
      {postCategory?.name ?? "All"} {count !== undefined && count}
    </div>
  )
}
