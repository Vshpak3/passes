import { CommentDto, PostDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, memo, useCallback, useRef, useState } from "react"

import { CommentFeed } from "src/components/organisms/profile/post/CommentFeed"
import { CommentCached } from "./CommentCached"
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
  const rootRef = useRef<HTMLDivElement>(null)
  const addNewComment = useCallback(
    (comment: CommentDto) => {
      setNewComments((state) => [comment, ...state])
      incrementNumComments()
      rootRef?.current?.scrollIntoView({ block: "start", behavior: "smooth" })
    },
    [incrementNumComments]
  )

  return (
    <div
      className={classNames(
        "mt-10 flex w-full scroll-mt-20 flex-col border-t-[1px] border-t-gray-300/10",
        hidden && "hidden"
      )}
      ref={rootRef}
    >
      {newComments.map((comment) => {
        return (
          <CommentCached
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
      <div>
        <NewCommentEditor
          addComment={addNewComment}
          focus={!hidden}
          postId={postId}
        />
      </div>
    </div>
  )
}

export const CommentSection = memo(CommentSectionUnemo)
