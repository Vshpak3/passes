import { CommentDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { useComment } from "src/hooks/entities/useComment"
import { Comment } from "./Comment"

export interface CommentCachedProps {
  comment: CommentDto
  ownsPost: boolean
  decrementNumComments: () => void
}

export const CommentCached: FC<CommentCachedProps> = ({ comment, ...res }) => {
  const { comment: cachedComment, update } = useComment(comment.commentId)
  useEffect(() => {
    if (!cachedComment) {
      update(comment)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedComment])

  return <Comment comment={cachedComment ?? comment} {...res} update={update} />
}
