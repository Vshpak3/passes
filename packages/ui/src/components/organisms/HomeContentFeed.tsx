import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  PostDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { FC } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { Header } from "src/components/molecules/performance/Header"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"

const Post = dynamic(
  () => import("src/components/organisms/profile/post/Post"),
  { ssr: false }
)

// TODO: fix formatting
const ContentFeedEmpty = (
  <div className="my-40 mx-auto flex flex-row items-center justify-center rounded-sm border border-gray-800 bg-gradient-to-r from-[#3D224A] px-3 py-2 text-center">
    <InfoIcon className="mr-2" />
    Posts of the creators you follow will be shown here.
  </div>
)

const ContentFeedLoading = (
  <div className="my-[40px] flex justify-center">
    <Loader />
  </div>
)

const ContentFeedEnd = (
  <div className="mt-[15px] flex justify-center">
    <div className="bg-[#1b141d]/50 px-10 py-5" role="alert">
      <span className="font-medium">
        No more posts are available at this time!
      </span>
    </div>
  </div>
)

export const HomeContentFeed: FC = () => {
  const api = new FeedApi()
  const { posts } = usePostWebhook()

  return (
    <>
      <Header />
      <div className="w-full bg-black">
        <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] md:pt-20 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
            <InfiniteScrollPagination<PostDto, GetFeedResponseDto>
              keyValue="/feed"
              fetch={async (req: GetFeedRequestDto) => {
                return await api.getFeed({ getFeedRequestDto: req })
              }}
              fetchProps={{}}
              emptyElement={ContentFeedEmpty}
              loadingElement={ContentFeedLoading}
              endElement={ContentFeedEnd}
              KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
                return (
                  <Post
                    post={{ ...arg, ...(posts[arg.postId] ?? {}) }}
                    inHomeFeed={true}
                  />
                )
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
