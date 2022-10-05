import {
  CreatePostRequestDto,
  GetFanWallResponseDto,
  GetFeedResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import { NewPost } from "src/components/organisms/profile/main-content/new-post"
import { KeyedMutator } from "swr"

import CreatorContentFeed from "./creator-content-feed"
import EventsFeed from "./events-feed"
import FanWallFeed from "./fan-wall-feed"
import PassesFeed from "./passes-feed"

export interface NewsFeedContentProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  activeTab: string
  posts: PostDto[]
  fanWallPosts?: GetFanWallResponseDto
  createPost: (values: CreatePostRequestDto) => void
  writeToFanWall: (values: CreatePostRequestDto) => Promise<void>
  removePost?: (postId: string) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto | undefined>
}

const NewsFeedContent: FC<NewsFeedContentProps> = ({
  profile,
  profileUsername,
  activeTab,
  ownsProfile,
  posts,
  fanWallPosts,
  createPost,
  removePost,
  writeToFanWall,
  mutatePosts
}) => {
  switch (activeTab) {
    case "post":
      return (
        <>
          {ownsProfile && (
            <NewPost
              // TODO: passes={profile?.passes}
              createPost={createPost}
              placeholder="What's on your mind?"
            />
          )}
          {posts?.length > 0 && (
            <CreatorContentFeed
              posts={posts}
              mutatePosts={mutatePosts}
              removePost={removePost}
              ownsProfile={ownsProfile}
            />
          )}
        </>
      )
    case "fanWall":
      return (
        <>
          <NewPost
            // TODO: passes={profile?.passes}
            placeholder={`Write something${
              profile?.displayName ? ` to ${profile?.displayName}...` : "..."
            }`}
            onlyText
            createPost={writeToFanWall}
          />
          <FanWallFeed
            fanWallPosts={fanWallPosts}
            profileUsername={profileUsername}
            ownsProfile={ownsProfile}
          />
        </>
      )
    case "events":
      return <EventsFeed />
    case "passes":
      return <PassesFeed profile={profile} />
    default:
      return <></>
  }
}

export default NewsFeedContent
