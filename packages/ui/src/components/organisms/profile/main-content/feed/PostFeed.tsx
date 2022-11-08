import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { Post } from "src/components/organisms/profile/post/Post"
import { usePinnedPosts } from "src/hooks/profile/usePinnedPosts"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"

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

export const PostFeed: FC<PostFeedProps> = ({ profileUserId, ownsProfile }) => {
  const api = new FeedApi()

  const [isNewPostAdded, setIsNewPostAdded] = useState(false)
  const { pinnedPosts } = usePinnedPosts(profileUserId)
  const { posts } = usePostWebhook()

  return (
    <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
      KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
        return <Post post={{ ...arg, ...(posts[arg.postId] ?? {}) }} />
      }}
      emptyElement={PostFeedEnd}
      endElement={PostFeedEnd}
      fetch={async (req: GetProfileFeedRequestDto) => {
        return await api.getFeedForCreator({
          getProfileFeedRequestDto: req
        })
      }}
      fetchProps={{ creatorId: profileUserId, pinned: false }}
      hasInitialElement={isNewPostAdded}
      keyValue={`/feed/creator/${profileUserId}`}
      loadingElement={PostFeedLoader}
    >
      {ownsProfile && (
        <NewPosts postUpdates={posts} setIsNewPostAdded={setIsNewPostAdded} />
      )}
      {pinnedPosts.map((post) => (
        <Post
          isPinned
          key={post.postId}
          post={{ ...post, ...(posts[post.postId] ?? {}) }}
        />
      ))}
    </InfiniteScrollPagination>
  )
}
