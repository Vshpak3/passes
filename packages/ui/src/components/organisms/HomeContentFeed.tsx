import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  PostDto
} from "@passes/api-client"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { FC } from "react"

import { FeedEnd } from "src/components/atoms/feed/FeedEnd"
import { FeedLoader } from "src/components/atoms/feed/FeedLoader"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { FollowButton } from "src/components/molecules/FollowButton"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { useFeaturedCreators } from "src/hooks/useFeaturedCreators"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"
import { PostCached } from "./profile/post/PostCached"

const ContentFeedEmpty = (
  <div className="my-20 mx-auto flex flex-row items-center justify-center rounded-sm border-y border-gray-800 bg-gradient-to-r from-[#3D224A] px-3 py-2 text-center">
    <InfoIcon className="mr-2" />
    Posts of the creators you follow will be shown here.
  </div>
)

export const HomeContentFeed: FC = () => {
  const api = new FeedApi()
  usePostWebhook()
  const { featuredCreators } = useFeaturedCreators()

  return (
    <div className="mt-16 grid w-full grid-cols-7 lg:mt-0">
      <div className="col-span-7 border-r-[1px] border-passes-gray lg:col-span-4">
        <SectionTitle className="mt-6 ml-4 lg:mt-4">Home</SectionTitle>
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
      <div className="min-safe-h-screen sticky col-span-3 hidden max-w-[500px] flex-col lg:flex lg:px-2 lg:pr-8 xl:pl-8">
        <div className="mt-2 hidden items-start md:flex">
          <CreatorSearchBar />
        </div>
        <div>
          <SectionTitle>Suggested</SectionTitle>
          {featuredCreators?.map((creator) => (
            <div
              className="flex items-center justify-between border-t border-passes-gray py-4"
              key={creator.userId}
            >
              <div className="overflow-x-hidden">
                <ProfileWidget isCreator user={creator} />
              </div>
              <FollowButton
                className="min-w-[89px]"
                creatorId={creator.userId}
                unfollowText="Following"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
