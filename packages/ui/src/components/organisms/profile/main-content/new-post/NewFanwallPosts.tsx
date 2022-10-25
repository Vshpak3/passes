import {
  CreateFanWallCommentRequestDto,
  FanWallCommentDto
} from "@passes/api-client"
import { FC, useState } from "react"

import { FanWallComment } from "src/components/organisms/profile/main-content/feed/FanWallComment"
import { useUser } from "src/hooks/useUser"
import { NewFanwallPost } from "./NewFanwallPost"

interface NewFanwallPosts {
  profileUserId: string
  ownsProfile: boolean
}

export const NewFanwallPosts: FC<NewFanwallPosts> = ({
  profileUserId,
  ownsProfile
}: NewFanwallPosts) => {
  const [newComments, setNewComments] = useState<FanWallCommentDto[]>([])
  const { user } = useUser()
  const createPost = async (
    createPost: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => {
    if (!user) {
      return
    }

    const comment: FanWallCommentDto = {
      fanWallCommentId,
      creatorId: createPost.creatorId,
      commenterId: user.userId,
      commenterDisplayName: user.displayName,
      commenterUsername: user.username,
      text: createPost.text,
      tags: createPost.tags,
      createdAt: new Date(),
      isOwner: true,
      isHidden: false
    }
    setNewComments([comment, ...newComments])
  }

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewFanwallPost creatorId={profileUserId || ""} createPost={createPost} />
      {newComments.map((comment) => (
        <FanWallComment
          key={comment.fanWallCommentId}
          comment={comment}
          ownsProfile={ownsProfile}
        />
      ))}
    </>
  )
}
