import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto
} from "@passes/api-client"
import { PostDto } from "@passes/api-client/src/models/PostDto"
import { FC, PropsWithChildren } from "react"
import InfiniteScrollPagination, {
  ComponentArg
} from "src/components/atoms/InfiniteScroll"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import { Post } from "src/components/organisms/profile/post/Post"
interface ContentFeedProps {
  creatorId?: string
}
const ContentFeed: FC<PropsWithChildren<ContentFeedProps>> = ({
  children,
  creatorId
}: PropsWithChildren<ContentFeedProps>) => {
  const api = new FeedApi()

  return (
    <>
      <ConditionRendering condition={!!creatorId}>
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          fetch={async (req: GetProfileFeedRequestDto) => {
            return await api.getFeedForCreator({
              getProfileFeedRequestDto: req
            })
          }}
          loader={<h3>Loading...</h3>} // TODO: add a better message
          endMessage={<h3>No more posts</h3>} // TODO: add a better message
          initProps={{ creatorId }}
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <div className="mt-6">
                <Post post={arg} removable={true} />
              </div>
            )
          }}
        >
          {children}
        </InfiniteScrollPagination>
      </ConditionRendering>
      <ConditionRendering condition={!creatorId}>
        <InfiniteScrollPagination<PostDto, GetFeedResponseDto>
          fetch={async (req: GetFeedRequestDto) => {
            return await api.getFeed({
              getFeedRequestDto: req
            })
          }}
          loader={<h3>Loading...</h3>} // TODO: add a better message
          endMessage={<h3>No more posts</h3>} // TODO: add a better message
          initProps={{}}
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <div className="mt-6">
                <Post post={arg} removable={true} />
              </div>
            )
          }}
        >
          {children}
        </InfiniteScrollPagination>
      </ConditionRendering>
    </>
  )
}

export default ContentFeed
