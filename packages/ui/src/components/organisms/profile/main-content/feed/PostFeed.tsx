import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { Post } from "src/components/organisms/profile/post/Post"
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
  const api = new FeedApi()

  const { posts, isConnected } = usePostWebhook()
  return (
    <>
      {isConnected && (
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          keyValue={`/feed/creator/${profileUserId}`}
          fetch={async (req: GetProfileFeedRequestDto) => {
            return await api.getFeedForCreator({
              getProfileFeedRequestDto: req
            })
          }}
          fetchProps={{ creatorId: profileUserId }}
          emptyElement={PostFeedEnd}
          loadingElement={PostFeedLoader}
          endElement={PostFeedEnd}
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return <Post post={{ ...arg, ...(posts[arg.postId] ?? {}) }} />
          }}
        >
          {ownsProfile && <NewPosts />}
        </InfiniteScrollPagination>
      )}
    </>
  )
}
