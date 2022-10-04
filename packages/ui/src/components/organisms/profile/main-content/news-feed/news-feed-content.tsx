import {
  CreatePostRequestDto,
  GetFanWallResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import { NewPost } from "src/components/organisms/profile/main-content/new-post"

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
}

const NewsFeedContent: FC<NewsFeedContentProps> = ({
  profile,
  profileUsername,
  activeTab,
  ownsProfile,
  posts,
  fanWallPosts,
  createPost,
  writeToFanWall
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
            <CreatorContentFeed posts={posts} ownsProfile={ownsProfile} />
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
