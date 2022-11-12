import {
  CreateFanWallCommentRequestDto,
  FanWallCommentDto
} from "@passes/api-client"
import { FC, useState } from "react"

import { FanWallCommentCached } from "src/components/organisms/profile/main-content/feed/FanWallCommentCached"
import { useUser } from "src/hooks/useUser"
import { NewFanwallPost } from "./NewFanwallPost"

interface NewFanwallPosts {
  profileUserId: string
  ownsProfile: boolean
}

export const NewFanwallPosts: FC<NewFanwallPosts> = ({
  profileUserId,
  ownsProfile
}) => {
  const [newComments, setNewComments] = useState<FanWallCommentDto[]>([])
  const { user } = useUser()
  const createPost = async (
    createPost: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => {
    if (!user) {
      return
    }

    const fanWallComment: FanWallCommentDto = {
      fanWallCommentId,
      creatorId: createPost.creatorId,
      commenterId: user.userId,
      commenterDisplayName: user.displayName,
      commenterUsername: user.username,
      commenterIsCreator: user.isCreator || false,
      text: createPost.text,
      tags: createPost.tags,
      createdAt: new Date(),
      isOwner: true,
      isHidden: false,
      deletedAt: null
    }
    setNewComments([fanWallComment, ...newComments])
  }

  // TODO: Missing the state to remove the post optimistically

  return (
    <>
      <NewFanwallPost
        createFanWallPost={createPost}
        creatorId={profileUserId || ""}
      />
      {newComments.map((fanWallComment) => (
        <FanWallCommentCached
          fanWallComment={fanWallComment}
          key={fanWallComment.fanWallCommentId}
          ownsProfile={ownsProfile}
        />
      ))}
    </>
  )
}
