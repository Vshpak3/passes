import {
  CommentApi,
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto
} from "@passes/api-client"
import { FC, useCallback, useState } from "react"
import { InfiniteLoad } from "src/components/atoms/InfiniteLoad"
import { ComponentArg } from "src/components/atoms/InfiniteScroll"
import { Comment } from "src/components/organisms/profile/post/Comment"

import { NewCommentEditor } from "./NewCommentEditor"

interface CommentSectionProps {
  postId: string
  ownsPost: boolean
  incrementNumComments: () => void
  decrementNumComments: () => void
}

const api = new CommentApi()

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  ownsPost,
  incrementNumComments
}) => {
  const [comments, setComments] = useState<CommentDto[]>([])

  const addComment = useCallback(
    (comment: CommentDto) => {
      setComments((state) => [comment, ...state])
      incrementNumComments()
    },
    [incrementNumComments]
  )

  return (
    <div
      className={
        "mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10"
      }
    >
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.commentId}
            comment={comment}
            removable={true}
            ownsPost={ownsPost}
          />
        )
      })}

      <InfiniteLoad<CommentDto, GetCommentsForPostResponseDto>
        keyValue={`/comments/${postId}`}
        fetch={async (req: GetCommentsForPostRequestDto) => {
          return await api.findCommentsForPost({
            getCommentsForPostRequestDto: req
          })
        }}
        KeyedComponent={({ arg }: ComponentArg<CommentDto>) => {
          return <Comment comment={arg} removable={true} ownsPost={ownsPost} />
        }}
        loadingElement={
          <div className="flex w-full items-center justify-center">
            <span className="h-7 w-7 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
          </div>
        }
        fetchProps={{ postId }}
      ></InfiniteLoad>
      <NewCommentEditor postId={postId} addComment={addComment} />
    </div>
  )
}
