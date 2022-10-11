import {
  FeedApi,
  GetProfileFeedRequestDto,
  GetProfileFeedResponseDto,
  PostDto
} from "@passes/api-client"
import { FC, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { NewFanwallPost } from "src/components/organisms/profile/main-content/new-post/NewFanwallPost"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"
import { Post } from "src/components/organisms/profile/post/Post"
import { PostDataContext } from "src/contexts/PostData"
import { useCreatorProfile } from "src/hooks/useCreatorProfile"

import { FanWallFeed } from "./FanWallFeed"
import { PassesFeed } from "./PassesFeed"

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
  <h3>No posts</h3> // TODO: add a better message
)

const ContentFeedLoading = (
  <h3>Loading...</h3> // TODO: add a better message
)

const ContentFeedEnd = (
  <h3>No more posts</h3> // TODO: add a better message
)

export interface ProfileContentFeedProps {
  activeTab: string
}

export const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
  activeTab
}) => {
  const { profile, ownsProfile } = useCreatorProfile()
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
          fetchProps={{ creatorId: profile?.userId || "" }}
          emptyElement={ContentFeedEmpty}
          loadingElement={ContentFeedLoading}
          endElement={ContentFeedEnd}
          KeyedComponent={PostKeyedComponent}
        >
          {ownsProfile && <NewPosts />}
        </InfiniteScrollPagination>
      )
    case "fanWall":
      return (
        <>
          <NewFanwallPost />
          <FanWallFeed ownsProfile={ownsProfile} />
        </>
      )
    case "passes":
      return <PassesFeed />
    default:
      return <></>
  }
}
