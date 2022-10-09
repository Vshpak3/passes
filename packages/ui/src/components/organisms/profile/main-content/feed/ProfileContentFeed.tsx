import {
  CreateFanWallCommentRequestDto,
  CreatePostRequestDto,
  GetFanWallResponseDto,
  GetFeedResponseDto,
  GetProfileResponseDto
} from "@passes/api-client"
import { FC } from "react"
import { NewPost } from "src/components/organisms/profile/main-content/new-post/NewPost"
import { KeyedMutator } from "swr"

import FanWallFeed from "./FanWallFeed"
import GeneralContentFeed from "./GeneralContentFeed"
import PassesFeed from "./PassesFeed"

export interface ProfileContentFeedProps {
  profile: GetProfileResponseDto
  profileUsername: string
  ownsProfile: boolean
  activeTab: string
  feed?: GetFeedResponseDto
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
  feed,
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
          {feed?.posts?.length && (
            <GeneralContentFeed
              creatorId={profile.userId}
              feed={feed}
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
          {fanWallPosts?.comments?.length && (
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
