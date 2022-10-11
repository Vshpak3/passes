import {
  CreateFanWallCommentRequestDto,
  FeedApi,
  GetFanWallResponseDto,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import InfiniteScrollPagination, {
  ComponentArg
} from "src/components/atoms/InfiniteScroll"
import { NewFanwallPost } from "src/components/organisms/profile/main-content/new-post/NewFanwallPost"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { Post } from "src/components/organisms/profile/post/Post"

import FanWallFeed from "./FanWallFeed"
import PassesFeed from "./PassesFeed"

const ContentFeedEmpty = (
  <h3>No posts</h3> // TODO: add a better message
)

const ContentFeedLoading = (
  <h3>Loading...</h3> // TODO: add a better message
)

const ContentFeedEnd = (
  <h3>No more posts</h3> // TODO: add a better message
)

export interface ProfileContentFeedProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  activeTab: string
  fanWallPosts?: GetFanWallResponseDto
  writeToFanWall: (values: CreateFanWallCommentRequestDto) => Promise<void>
}

const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  profile,
  profileUsername,
  activeTab,
  ownsProfile,
  fanWallPosts,
  writeToFanWall
}) => {
  const api = new FeedApi()

  switch (activeTab) {
    case "post":
      return (
        <InfiniteScrollPagination<PostDto, GetProfileFeedResponseDto>
          fetch={async (req: GetProfileFeedRequestDto) => {
            return await api.getFeedForCreator({
              getProfileFeedRequestDto: req
            })
          }}
          fetchProps={{ creatorId: profile.userId }}
          emptyElement={ContentFeedEmpty}
          loadingElement={ContentFeedLoading}
          endElement={ContentFeedEnd}
          KeyedComponent={({ arg }: ComponentArg<PostDto>) => {
            return (
              <div className="mt-6">
                <Post post={arg} removable={true} />
              </div>
            )
          }}
        >
          {ownsProfile && (
            <NewPosts profile={profile} username={profileUsername} />
          )}
        </InfiniteScrollPagination>
      )
    case "fanWall":
      return (
        <>
          <NewFanwallPost
            placeholder={`Write something${
              profile?.displayName ? ` to ${profile?.displayName}...` : "..."
            }`}
            createPost={writeToFanWall}
          />
          {!!fanWallPosts?.data?.length && (
            <FanWallFeed
              creatorId={profile.userId}
              fanWallPosts={fanWallPosts}
              profileUsername={profileUsername}
              ownsProfile={ownsProfile}
            />
          )}
        </>
      )
    case "passes":
      return <PassesFeed profile={profile} />
    default:
      return <></>
  }
}

export default ProfileContentFeed
