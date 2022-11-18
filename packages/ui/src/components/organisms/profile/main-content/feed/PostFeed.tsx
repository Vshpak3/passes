import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, memo, useContext, useMemo, useState } from "react"

import { FeedEnd } from "src/components/atoms/feed/FeedEnd"
import { FeedLoader } from "src/components/atoms/feed/FeedLoader"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { PostCategoryPill } from "src/components/molecules/post/PostCategoryPill"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { PostCached } from "src/components/organisms/profile/post/PostCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { useCreatorStats } from "src/hooks/profile/useCreatorStats"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { ProfileContext } from "src/pages/[username]"

interface PostFeedProps {
  profileUserId: string
  ownsProfile: boolean
}

const PostFeedUnmemo: FC<PostFeedProps> = ({ profileUserId, ownsProfile }) => {
  const api = new FeedApi()

  const { pinnedPosts } = useContext(ProfileContext)
  usePostWebhook()

  const [postCategoryId, setPostCategoryId] = useState<string>()

  const fetchProps = useMemo(() => {
    return { creatorId: profileUserId, pinned: false, postCategoryId }
  }, [profileUserId, postCategoryId])
  const { postCategories } = usePostCategories(profileUserId)
  const { creatorStats } = useCreatorStats(profileUserId)
  const showCount = creatorStats?.numPosts !== undefined
  PostCategoryPill

  return (
    <>
      {!!postCategories?.length && (
        <div className="flex flex-row justify-center gap-[10px] overflow-x-auto p-5 scrollbar-hide">
          <PostCategoryPill
            count={creatorStats?.numPosts}
            onClick={setPostCategoryId}
          />
          {postCategories?.map((postCategory) => (
            <PostCategoryPill
              count={showCount ? postCategory.count : undefined}
              key={postCategory.postCategoryId}
              onClick={setPostCategoryId}
              postCategory={postCategory}
            />
          ))}
        </div>
      )}
      <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
          return <PostCached post={{ ...arg }} />
        }}
        emptyElement={<FeedEnd message="No posts are available at this time" />}
        endElement={
          <FeedEnd message="No more posts are available at this time" />
        }
        fetch={async (req: GetProfileFeedRequestDto) => {
          return await api.getFeedForCreator({
            getProfileFeedRequestDto: req
          })
        }}
        fetchProps={fetchProps}
        keySelector="postId"
        keyValue={`/pages/feed/creator/${profileUserId}`}
        loadingElement={FeedLoader}
      >
        {ownsProfile && <NewPosts />}
        {pinnedPosts.map((post) => (
          <PostCached isPinned key={post.postId} post={post} />
        ))}
      </InfiniteScrollPagination>
    </>
  )
}

export const PostFeed = memo(PostFeedUnmemo)
