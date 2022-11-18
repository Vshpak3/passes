import { memo } from "react"

import { Button } from "src/components/atoms/button/Button"
import { PostCategoryPillCached } from "src/components/molecules/post/PostCategoryPillCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"

interface PostCategoryPillsProp {
  setPostCategoryId: (postCategoryId?: string) => void
  userId: string
}

const PostCategoryPillsUnmemo = ({
  setPostCategoryId,
  userId
}: PostCategoryPillsProp) => {
  const { postCategories } = usePostCategories(userId)
  const { creatorStats } = useCreatorStats(userId)
  const numPosts = creatorStats?.numPosts
  const showCount = numPosts !== undefined

  return (
    <>
      {!!postCategories?.length && (
        <div className="flex flex-row justify-center gap-[10px] overflow-x-auto p-5 scrollbar-hide">
          <Button onClick={() => setPostCategoryId(undefined)}>
            All {showCount && numPosts}
          </Button>
          {postCategories?.map((postCategory) => (
            <PostCategoryPillCached
              key={postCategory.postCategoryId}
              onClick={setPostCategoryId}
              postCategory={postCategory}
              showCount={showCount}
            />
          ))}
        </div>
      )}
    </>
  )
}

export const PostCategoryPills = memo(PostCategoryPillsUnmemo)
