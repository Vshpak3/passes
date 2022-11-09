import {
  FeedApi,
  GetFeedRequestDto,
  GetFeedResponseDto,
  PostDto
} from "@passes/api-client"
import dynamic from "next/dynamic"
import Link from "next/link"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import { FC } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Loader } from "src/components/atoms/Loader"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { FollowButton } from "src/components/molecules/FollowButton"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { useFeaturedCreators } from "src/hooks/useFeaturedCreators"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { CreatorSearchBar } from "src/layout/CreatorSearchBar"

const Post = dynamic(
  () => import("src/components/organisms/profile/post/Post"),
  { ssr: false }
)

// TODO: fix formatting
const ContentFeedEmpty = (
  <div className="my-40 mx-auto flex flex-row items-center justify-center rounded-sm border-y border-gray-800 bg-gradient-to-r from-[#3D224A] px-3 py-2 text-center">
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
    <div className="bg-[#12070E]/50 px-10 py-5" role="alert">
      <span className="font-medium">
        No more posts are available at this time!
      </span>
    </div>
  </div>
)

export const HomeContentFeed: FC = () => {
  const api = new FeedApi()
  const { posts } = usePostWebhook()
  const { featuredCreators } = useFeaturedCreators()

  return (
    <div className="mt-10 grid w-full grid-cols-7 lg:mt-0">
      <div className="col-span-7 lg:col-span-4">
        <SectionTitle className="ml-4">Home</SectionTitle>
        <InfiniteScrollPagination<PostDto, GetFeedResponseDto>
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <Post
                inHomeFeed
                post={{ ...arg, ...(posts[arg.postId] ?? {}) }}
              />
            )
          }}
          emptyElement={ContentFeedEmpty}
          endElement={ContentFeedEnd}
          fetch={async (req: GetFeedRequestDto) => {
            return await api.getFeed({ getFeedRequestDto: req })
          }}
          fetchProps={{}}
          keyValue="/feed"
          loadingElement={ContentFeedLoading}
        />
      </div>
      <div className="sticky col-span-3 hidden min-h-screen max-w-[500px] flex-col border-l-[0.5px] border-gray-600 lg:flex lg:px-2 xl:pl-8">
        <div className="mt-2 hidden items-start md:flex">
          <CreatorSearchBar />
        </div>
        <div>
          <SectionTitle>Suggested</SectionTitle>
          {featuredCreators?.map((creator) => (
            <div
              className="flex items-center border-y border-gray-600/25 py-4"
              key={creator.userId}
            >
              <Link className="flex flex-1" href={`/${creator.username}`}>
                <ProfileThumbnail userId={creator.userId} />
                <div className="ml-2 flex flex-col">
                  <span>{creator.displayName}</span>
                  <span className="text-passes-dark-gray">
                    @{creator.username}
                  </span>
                </div>
              </Link>
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
