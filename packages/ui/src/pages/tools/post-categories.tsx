import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"

import { FeedEnd } from "src/components/atoms/feed/FeedEnd"
import { FeedLoader } from "src/components/atoms/feed/FeedLoader"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"

export const PostCategories: FC = () => {
  const api = new FeedApi()
  usePostWebhook()

  return (
    <div className="mt-16 grid w-full grid-cols-7 lg:mt-0">
      <div className="col-span-7 border-r-[1px] border-passes-gray lg:col-span-4">
        <div className="flex h-16">
          <SectionTitle className="mt-3 ml-4 pt-1 lg:mt-4">Home</SectionTitle>
        </div>
        <InfiniteScrollPagination<PostDto, GetFeedResponseDto>
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return <PostCached inHomeFeed post={arg} />
          }}
          emptyElement={ContentFeedEmpty}
          endElement={
            <FeedEnd message="No more posts are available at this time" />
          }
          fetch={async (req: GetFeedRequestDto) => {
            return await api.getFeed({ getFeedRequestDto: req })
          }}
          fetchProps={{}}
          keySelector="postId"
          keyValue="/pages/feed"
          loadingElement={FeedLoader}
        />
      </div>
      <div className="min-safe-h-screen sticky col-span-3 hidden max-w-[500px] flex-col lg:flex lg:px-2 lg:pr-8 xl:pl-8" />
    </div>
  )
}
