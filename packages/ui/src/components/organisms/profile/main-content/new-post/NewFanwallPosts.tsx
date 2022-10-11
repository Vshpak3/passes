import {
  CreateFanWallCommentRequestDto,
  FanWallCommentDto
} from "@passes/api-client"
import { useState } from "react"
import { FanWallComment } from "src/components/organisms/profile/main-content/feed/FanWallComment"
import { useProfile } from "src/hooks/useProfile"
import { useUser } from "src/hooks/useUser"

import { NewFanwallPost } from "./NewFanwallPost"

export const NewFanwallPosts: React.FC = () => {
  const { profileUserId } = useProfile()
  const [newComments, setNewComments] = useState<FanWallCommentDto[]>([])
  const { user } = useUser()
  const createPost = async (
    createPost: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => {
    const comment: FanWallCommentDto = {
      fanWallCommentId,
      creatorId: createPost.creatorId,
      commenterId: user?.userId ?? "",
      commenterDisplayName: user?.displayName ?? "",
      commenterUsername: user?.username ?? "",
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
      <div className="mt-9 space-y-6">
        {newComments.map((comment) => (
          <FanWallComment
            key={comment.fanWallCommentId}
            comment={comment}
            removable={true}
          />
        ))}
      </div>
    </>
  )
}
