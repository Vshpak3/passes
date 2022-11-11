import { CommentDto, PostDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, memo, useCallback, useState } from "react"

import { Comment } from "src/components/organisms/profile/post/Comment"
import { CommentFeed } from "src/components/organisms/profile/post/CommentFeed"
import { NewCommentEditor } from "./NewCommentEditor"

interface CommentSectionProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  incrementNumComments: () => void
  decrementNumComments: () => void
  hidden: boolean
}

const CommentSectionUnemo: FC<CommentSectionProps> = ({
  postId = "",
  ownsPost,
  hidden,
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
    <div
      className={classNames(
        "mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10",
        hidden && "hidden"
      )}
    >
      {newComments.map((comment) => {
        return (
          <Comment
            comment={comment}
            decrementNumComments={decrementNumComments}
            key={comment.commentId}
            ownsPost={ownsPost}
          />
        )
      })}
      <CommentFeed
        decrementNumComments={decrementNumComments}
        ownsPost={ownsPost}
        postId={postId}
      />
      <div className="z-[50]">
        <NewCommentEditor addComment={addNewComment} postId={postId} />
      </div>
    </div>
  )
}

export const CommentSection = memo(CommentSectionUnemo)
