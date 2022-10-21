import { GetProfileFeedResponseDto, PostDto } from "@passes/api-client"
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

export interface PostFeedProps {
  profileUserId: string
  ownsProfile: boolean
}

export const PostFeed: FC<PostFeedProps> = ({ profileUserId, ownsProfile }) => {
  const [isNewPostAdded, setIsNewPostAdded] = useState(false)
  const { getFeedForCreator, pinnedPosts } = useFeed(profileUserId)
  const { posts, isConnected, isLogged } = usePostWebhook()

  return (
    <>
      {(isConnected || !isLogged) && (
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          keyValue={`/feed/creator/${profileUserId}`}
          fetch={getFeedForCreator}
          fetchProps={{ creatorId: profileUserId, pinned: false }}
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <Post
                post={{ ...arg, ...(posts[arg.postId] ?? {}) }}
                pinnedPostCount={pinnedPosts.length}
              />
            )
          }}
          emptyElement={PostFeedEnd}
          loadingElement={PostFeedLoader}
          endElement={PostFeedEnd}
          hasInitialElement={isNewPostAdded}
        >
          {ownsProfile && <NewPosts setIsNewPostAdded={setIsNewPostAdded} />}
          {pinnedPosts.map((post) => (
            <Post key={post.postId} post={post} isPinned={true} />
          ))}
        </InfiniteScrollPagination>
      )}
    </>
  )
}
