import { CommentDto, ListMemberDto, PostDto } from "@passes/api-client"
import { FC, useCallback, useState } from "react"
import { Comment } from "src/components/organisms/profile/post/Comment"

import { CommentFeed } from "./CommentFeed"
import { NewCommentEditor } from "./NewCommentEditor"

interface CommentSectionProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  incrementNumComments: () => void
  decrementNumComments: () => void
  isCreator?: boolean
  blockedUsers?: ListMemberDto[]
}

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  ownsPost,
  incrementNumComments,
  isCreator,
  blockedUsers
}) => {
  const [newComments, setNewComments] = useState<CommentDto[]>([])

  const addNewComment = useCallback(
    (comment: CommentDto) => {
      setNewComments((state) => [...state, comment])
      incrementNumComments()
    },
    [incrementNumComments]
  )

  return (
    <div className="mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10">
      <CommentFeed postId={postId} ownsPost={ownsPost} />
      {newComments.map((comment) => {
        return (
          <Comment
            key={comment.commentId}
            comment={comment}
            removable={true}
            ownsPost={ownsPost}
            isCreator={isCreator}
            blockedUsers={blockedUsers}
          />
        )
      })}
      <CommentFeed
        postId={postId}
        ownsPost={ownsPost}
        isCreator={isCreator}
        blockedUsers={blockedUsers}
      />
      <NewCommentEditor postId={postId} addComment={addNewComment} />
    </div>
  )
}
