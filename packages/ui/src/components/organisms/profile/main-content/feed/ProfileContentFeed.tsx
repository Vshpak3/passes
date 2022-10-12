import {
  FanWallApi,
  FanWallCommentDto,
  FeedApi,
  GetFanWallRequestDto,
  GetFanWallResponseDto,
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
import { NewFanwallPosts } from "src/components/organisms/profile/main-content/new-post/NewFanwallPosts"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { NavigationOptions } from "src/components/organisms/profile/main-content/ProfileNavigation"
import { Post } from "src/components/organisms/profile/post/Post"
import { useProfile } from "src/hooks/useProfile"

import { FanWallComment } from "./FanWallComment"
import { PassesFeed } from "./PassesFeed"

const ContentFeedEmpty = (
  <h3>No posts</h3> // TODO: add a better message
)

const ContentFeedLoading = <Loader />

const ContentFeedEnd = (
  <div className="mt-[15px] flex justify-center">
    <div className="bg-[#1b141d]/50 px-10 py-5" role="alert">
      <span className="font-medium">
        No more posts are available at this time!
      </span>
    </div>
  </div>
)

export interface ProfileContentFeedProps {
  activeTab: NavigationOptions
}

export const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  activeTab
}) => {
  const { profileUserId, ownsProfile, loadingProfileInfo } = useProfile()
  const api = new FeedApi()

  if (loadingProfileInfo || !profileUserId) {
    return <></>
  }

  switch (activeTab) {
    case NavigationOptions.POST:
      return (
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          keyValue={`/feed/creator/${profileUserId}`}
          fetch={async (req: GetProfileFeedRequestDto) => {
            return await api.getFeedForCreator({
              getProfileFeedRequestDto: req
            })
          }}
          fetchProps={{ creatorId: profileUserId }}
          emptyElement={ContentFeedEmpty}
          loadingElement={ContentFeedLoading}
          endElement={ContentFeedEnd}
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
    case NavigationOptions.FANWALL:
      return (
        <InfiniteScrollPagination<FanWallCommentDto, GetFanWallResponseDto>
          keyValue={`/fanwall/${profileUserId}`}
          fetch={async (req: GetFanWallRequestDto) => {
            const api = new FanWallApi()
            return await api.getFanWallForCreator({
              getFanWallRequestDto: req
            })
          }}
          fetchProps={{ creatorId: profileUserId }}
          emptyElement={ContentFeedEmpty}
          loadingElement={ContentFeedLoading}
          endElement={ContentFeedEnd}
          KeyedComponent={({ arg }: ComponentArg<FanWallCommentDto>) => {
            return (
              <div className="flex py-3">
                <FanWallComment comment={arg} removable={true} />
              </div>
            )
          }}
        >
          <NewFanwallPosts profileUserId={profileUserId} />
        </InfiniteScrollPagination>
      )
    case NavigationOptions.PASSES:
      return <PassesFeed creatorId={profileUserId} />
  }
}
