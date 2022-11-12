import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { FC, memo, useContext } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { ProfileContext } from "src/pages/[username]"

const PostCached = dynamic(
  () => import("src/components/organisms/profile/post/PostCached"),
  { ssr: false }
)

const PostFeedLoader = (
  <div className="my-[40px] flex justify-center">
    <Loader />
  </div>
)

const PostFeedEnd = (
  <div className="my-4 flex justify-center pb-16 lg:my-8">
    <div className="bg-[#12070E]/50 px-10 py-5" role="alert">
      <span className="font-medium">
        No more posts are available at this time!
      </span>
    </div>
  </div>
)

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
      emptyElement={PostFeedEnd}
      endElement={PostFeedEnd}
      fetch={async (req: GetProfileFeedRequestDto) => {
        return await api.getFeedForCreator({
          getProfileFeedRequestDto: req
        })
      }}
      fetchProps={{ creatorId: profileUserId, pinned: false }}
      keySelector="postId"
      keyValue={`/feed/creator/${profileUserId}`}
      loadingElement={PostFeedLoader}
    >
      {ownsProfile && <NewPosts />}
      {pinnedPosts.map((post) => (
        <PostCached isPinned key={post.postId} post={post} />
      ))}
    </InfiniteScrollPagination>
  )
}

export const PostFeed = memo(PostFeedUnmemo)
