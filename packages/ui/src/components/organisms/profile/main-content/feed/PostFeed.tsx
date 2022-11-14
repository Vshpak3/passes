import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, memo, useContext } from "react"

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

interface PostFeedProps {
  profileUserId: string
  ownsProfile: boolean
}

const PostFeedUnmemo: FC<PostFeedProps> = ({ profileUserId, ownsProfile }) => {
  const api = new FeedApi()

  const { pinnedPosts } = useContext(ProfileContext)
  usePostWebhook()

  return (
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
      fetchProps={{ creatorId: profileUserId, pinned: false }}
      keySelector="postId"
      keyValue={`/pages/feed/creator/${profileUserId}`}
      loadingElement={FeedLoader}
    >
      {ownsProfile && <NewPosts />}
      {pinnedPosts.map((post) => (
        <PostCached isPinned key={post.postId} post={post} />
      ))}
    </InfiniteScrollPagination>
  )
}

export const PostFeed = memo(PostFeedUnmemo)
