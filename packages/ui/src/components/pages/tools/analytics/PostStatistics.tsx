import {
  GetPostsRequestDto,
  GetPostsResponseDto,
  PostApi,
  PostDto
} from "@passes/api-client"
import React from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { PostStatistic } from "src/components/organisms/analytics/PostStatistic"

export const PostStatistics = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between border-b border-passes-dark-200">
        <div className=" mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Date & Time</span>
        </div>
        <div className=" mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Text</span>
        </div>
        <div className="mb-4 flex flex-1 items-center justify-center gap-2">
          <span className="text-[12px] font-[500]">Attachments</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Price</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Purchases</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Tips</span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="mb-4 text-[12px] font-[500]">Purchase Earnings</span>
        </div>
        <div className=" mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Delete</span>
        </div>
      </div>
      <InfiniteScrollPagination<PostDto, GetPostsResponseDto>
        keyValue={`posts`}
        fetch={async (req: GetPostsRequestDto) => {
          const api = new PostApi()
          return await api.getPosts({
            getPostsRequestDto: req
          })
        }}
        fetchProps={{}}
        emptyElement={<span>No posts to show</span>}
        KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
          return <PostStatistic post={arg} />
        }}
      />
    </div>
  )
}
