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

const PostFeedEmpty = (
  <h3>No posts</h3> // TODO: add a better message
)

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
  return (
    <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
      keyValue={`/feed/creator/${profileUserId}`}
      fetch={async (req: GetProfileFeedRequestDto) => {
        const api = new FeedApi()
        return await api.getFeedForCreator({
          getProfileFeedRequestDto: req
        })
      }}
      fetchProps={{ creatorId: profileUserId }}
      emptyElement={PostFeedEmpty}
      loadingElement={PostFeedLoader}
      endElement={PostFeedEnd}
      KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
        return (
          <div className="mt-6">
            <Post post={arg} />
          </div>
        )
      }}
    >
      {ownsProfile && <NewPosts />}
    </InfiniteScrollPagination>
  )
}
