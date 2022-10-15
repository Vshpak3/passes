import { CommentDto, PostDto } from "@passes/api-client"
import { FC, useCallback, useState } from "react"
import { Comment } from "src/components/organisms/profile/post/Comment"

import { CommentFeed } from "./CommentFeed"
import { NewCommentEditor } from "./NewCommentEditor"

interface CommentSectionProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  incrementNumComments: () => void
  decrementNumComments: () => void
}

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  ownsPost,
  incrementNumComments
}) => {
  const [newComments, setNewComments] = useState<CommentDto[]>([])

  const addNewComment = useCallback(
    (comment: CommentDto) => {
      setNewComments((state) => [comment, ...state])
      incrementNumComments()
    },
    [incrementNumComments]
  )

  return (
    <div className="mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10">
      {newComments.map((comment) => {
        return (
          <Comment
            key={comment.commentId}
            comment={comment}
            removable={true}
            ownsPost={ownsPost}
          />
        )
      })}
      <CommentFeed postId={postId} ownsPost={ownsPost} />
      <NewCommentEditor postId={postId} addComment={addNewComment} />
    </div>
  )
}
