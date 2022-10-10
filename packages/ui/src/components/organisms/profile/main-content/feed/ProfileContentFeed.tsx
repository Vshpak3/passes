import {
  CreateFanWallCommentRequestDto,
  GetFanWallResponseDto,
  GetProfileResponseDto
} from "@passes/api-client"
import { FC } from "react"
import { NewFanwallPost } from "src/components/organisms/profile/main-content/new-post/NewFanwallPost"
import { NewPosts } from "src/components/organisms/profile/main-content/new-post/NewPosts"

import ContentFeed from "./ContentFeed"
import FanWallFeed from "./FanWallFeed"
import PassesFeed from "./PassesFeed"

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
  switch (activeTab) {
    case "post":
      return (
        <>
          <ContentFeed creatorId={profile.userId}>
            {ownsProfile && (
              <NewPosts profile={profile} username={profileUsername} />
            )}
          </ContentFeed>
        </>
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
