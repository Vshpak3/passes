import { CommentDto, PostDto } from "@passes/api-client"
import { FC, memo, useCallback, useState } from "react"

import { Comment } from "src/components/organisms/profile/post/Comment"
import { CommentFeed } from "src/components/organisms/profile/post/CommentFeed"
import { NewCommentEditor } from "./NewCommentEditor"

interface CommentSectionProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  incrementNumComments: () => void
  decrementNumComments: () => void
}

const CommentSectionUnemo: FC<CommentSectionProps> = ({
  postId = "",
  ownsPost,
  incrementNumComments,
  decrementNumComments
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
            ownsPost={ownsPost}
            decrementNumComments={decrementNumComments}
          />
        )
      })}
      <CommentFeed
        postId={postId}
        ownsPost={ownsPost}
        decrementNumComments={decrementNumComments}
      />
      <NewCommentEditor postId={postId} addComment={addNewComment} />
    </div>
  )
}

export const CommentSection = memo(CommentSectionUnemo)
