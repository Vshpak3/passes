import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  PostDto
} from "@passes/api-client"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { FC, useState } from "react"
import InfiniteScrollPagination, {
  ComponentArg
} from "src/components/atoms/InfiniteScroll"
import { Post } from "src/components/organisms/profile/post/Post"
import { PostDataContext } from "src/contexts/PostData"

const PostKeyedComponent = ({ arg }: ComponentArg<PostDto>) => {
  const [isRemoved, setIsRemoved] = useState(false)

  return (
    <PostDataContext.Provider value={{ ...arg, isRemoved, setIsRemoved }}>
      <div className="mt-6">
        <Post />
      </div>
    </PostDataContext.Provider>
  )
}

const ContentFeedEmpty = (
  <div className="my-40 mx-auto flex flex-row items-center justify-center rounded-sm border border-gray-800 bg-gradient-to-r from-[#3D224A] px-3 py-2 text-center">
    <InfoIcon className="mr-2" />
    Posts of the creators you follow will be shown here.
  </div> // TODO: fix formatting
)

const ContentFeedLoading = (
  <h3>Loading...</h3> // TODO: add a better message
)

const ContentFeedEnd = (
  <h3>No more posts</h3> // TODO: add a better message
)

export const HomeContentFeed: FC = () => {
  const api = new FeedApi()

  return (
    <div className="w-full bg-black">
      <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20 lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
        <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
          <InfiniteScrollPagination<PostDto, GetFeedResponseDto>
            fetch={async (req: GetFeedRequestDto) => {
              return await api.getFeed({ getFeedRequestDto: req })
            }}
            fetchProps={{}}
            emptyElement={ContentFeedEmpty}
            loadingElement={ContentFeedLoading}
            endElement={ContentFeedEnd}
            KeyedComponent={PostKeyedComponent}
          />
        </div>
      </div>
    </div>
  )
}
