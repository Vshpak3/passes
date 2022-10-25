import {
  GetCreatorStatsResponseDto,
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
import { useFeed } from "src/hooks/profile/useFeed"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { KeyedMutator } from "swr"

const PostFeedLoader = (
  <div className="my-[40px] flex justify-center">
    <Loader />
  </div>
)

const PostFeedEnd = (
  <div className="my-[40px] flex justify-center">
    <div className="bg-[#1b141d]/50 px-10 py-5" role="alert">
      <span className="font-medium">
        No more posts are available at this time!
      </span>
    </div>
  </div>
)

interface PostFeedProps {
  profileUserId: string
  ownsProfile: boolean
  mutateProfileStats?: KeyedMutator<GetCreatorStatsResponseDto>
}

export const PostFeed: FC<PostFeedProps> = ({
  profileUserId,
  ownsProfile,
  mutateProfileStats
}) => {
  const [isNewPostAdded, setIsNewPostAdded] = useState(false)
  const { getFeedForCreator, pinnedPosts } = useFeed(profileUserId)
  const { posts } = usePostWebhook()

  return (
    <>
      <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
        keyValue={`/feed/creator/${profileUserId}`}
        fetch={getFeedForCreator}
        fetchProps={{ creatorId: profileUserId, pinned: false }}
        KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
          return (
            <Post
              post={{ ...arg, ...(posts[arg.postId] ?? {}) }}
              pinnedPostCount={pinnedPosts.length}
              mutateProfileStats={mutateProfileStats}
            />
          )
        }}
        emptyElement={PostFeedEnd}
        loadingElement={PostFeedLoader}
        endElement={PostFeedEnd}
        hasInitialElement={isNewPostAdded}
      >
        {ownsProfile && (
          <NewPosts setIsNewPostAdded={setIsNewPostAdded} postUpdates={posts} />
        )}
        {pinnedPosts.map((post) => (
          <Post
            key={post.postId}
            post={{ ...post, ...(posts[post.postId] ?? {}) }}
            isPinned={true}
            mutateProfileStats={mutateProfileStats}
          />
        ))}
      </InfiniteScrollPagination>
    </>
  )
}
