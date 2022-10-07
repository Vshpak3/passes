import {
  CreateFanWallCommentRequestDto,
  CreatePostRequestDto,
  GetFanWallResponseDto,
  GetFeedResponseDto,
  GetProfileResponseDto,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import { NewPost } from "src/components/organisms/profile/main-content/new-post"
import { KeyedMutator } from "swr"

import GeneralContentFeed from "./CreatorContentFeed"
import FanWallFeed from "./FanWallFeed"
import PassesFeed from "./PassesFeed"

export interface ProfileContentFeedProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  activeTab: string
  posts: PostDto[]
  fanWallPosts?: GetFanWallResponseDto
  createPost: (values: CreatePostRequestDto) => void
  writeToFanWall: (values: CreateFanWallCommentRequestDto) => Promise<void>
  removePost?: (postId: string) => void
  mutatePosts?: KeyedMutator<GetFeedResponseDto>
}

const ProfileContentFeed: FC<ProfileContentFeedProps> = ({
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
              initScheduledTime={null}
              // TODO: passes={profile?.passes}
              createPost={createPost}
              placeholder="What's on your mind?"
            />
          )}
          {posts?.length > 0 && (
            <GeneralContentFeed
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
            initScheduledTime={null}
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
    case "passes":
      return <PassesFeed profile={profile} />
    default:
      return <></>
  }
}

export default ProfileContentFeed
