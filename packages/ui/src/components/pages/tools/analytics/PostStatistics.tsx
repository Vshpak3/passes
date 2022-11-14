import { GetPostsResponseDto, PostDto } from "@passes/api-client"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import PostStatisticCached from "src/components/organisms/analytics/PostStatisticCached"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"

export const PostStatistics = () => {
  const { getPosts } = useUpdatePost()

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between border-b border-passes-dark-200">
        <div className="mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Date & Time</span>
        </div>
        <div className="mb-4 flex flex-1 justify-center truncate">
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
        <div className="mb-4 flex flex-1 justify-center">
          <span className="text-[12px] font-[500]">Delete</span>
        </div>
      </div>
      <InfiniteScrollPagination<PostDto, GetPostsResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
          return <PostStatisticCached post={arg} />
        }}
        emptyElement={<span>No posts to show</span>}
        fetch={getPosts}
        fetchProps={{}}
        keySelector="postId"
        keyValue="/pages/posts/statistics"
        options={{ revalidateOnMount: true }}
      />
    </div>
  )
}
