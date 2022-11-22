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
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { PostCached } from "src/components/organisms/profile/post/PostCached"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { ProfileContext } from "src/pages/[username]"
import { PostCategoryPills } from "./PostCategoryPills"

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
  return (
    <>
      <PostCategoryPills
        postCategoryId={postCategoryId}
        setPostCategoryId={setPostCategoryId}
        userId={profileUserId}
      />
      <div key={postCategoryId}>
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <PostCached allowPinned={!!postCategoryId} post={{ ...arg }} />
            )
          }}
          emptyElement={
            <FeedEnd message="No posts are available at this time" />
          }
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
          keyValue={`/pages/feed/creator/${profileUserId}/${postCategoryId}`}
          loadingElement={FeedLoader}
        >
          {ownsProfile && <NewPosts />}
          {!postCategoryId &&
            pinnedPosts.map((post) => (
              <PostCached
                isPinned
                key={post.postId}
                post={post}
                toUpdate={false}
              />
            ))}
        </InfiniteScrollPagination>
      </div>
    </>
  )
}

export const PostFeed = memo(PostFeedUnmemo)
