import { memo } from "react"

import { PostCategoryPillCached } from "src/components/molecules/post/PostCategoryPillCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"

interface PostCategoryPillsProp {
  setPostCategoryId: (postCategoryId?: string) => void
  userId: string
  postCategoryId: string
}

const PostCategoryPillsUnmemo = ({
  setPostCategoryId,
  userId,
  postCategoryId
}: PostCategoryPillsProp) => {
  const { postCategories } = usePostCategories(userId)

  return (
    <>
      {!!postCategories?.length && (
        <div className="flex flex-row justify-center gap-[10px] overflow-x-auto p-5 scrollbar-hide">
          {/* <Button onClick={() => setPostCategoryId(undefined)}>
            All {showCount && numPosts}
          </Button> */}
          {postCategories?.map((postCategory) => (
            <PostCategoryPillCached
              key={postCategory.postCategoryId}
              onClick={setPostCategoryId}
              postCategory={postCategory}
              selected={postCategory.postCategoryId === postCategoryId}
              showCount={false}
            />
          ))}
        </div>
      )}
    </>
  )
}

export const PostCategoryPills = memo(PostCategoryPillsUnmemo)
