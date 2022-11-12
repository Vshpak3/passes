import { GetPostsResponseDto, PostDto } from "@passes/api-client"
import dynamic from "next/dynamic"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { useUpdatePost } from "src/hooks/profile/useUpdatePost"

const PostStatisticCached = dynamic(
  () => import("src/components/organisms/analytics/PostStatisticCached"),
  { ssr: false }
)

const PostStatistics = () => {
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
        keyValue="posts"
        options={{ revalidateOnMount: true }}
      />
    </div>
  )
}

export default PostStatistics // eslint-disable-line import/no-default-export
