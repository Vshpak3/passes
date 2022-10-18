import {
  CommentApi,
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
  PostDto
} from "@passes/api-client"
import React from "react"
import {
  InfiniteLoad,
  LoadMsgPositionEnum
} from "src/components/atoms/InfiniteLoad"
import { ComponentArg } from "src/components/atoms/InfiniteScroll"

import { Comment } from "./Comment"

interface CommentFeedProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  numComments?: number
  decrementNumComments?: () => void
}

const api = new CommentApi()

export const CommentFeed: React.FC<CommentFeedProps> = ({
  postId,
  ownsPost,
  numComments
  decrementNumComments
}) => {
  return (
    <InfiniteLoad<CommentDto, GetCommentsForPostResponseDto>
      keyValue={`/comments/${postId}`}
      isReverse
      loadMsg="Load previous comments"
      numComments={numComments}
      loadMsgPosition={LoadMsgPositionEnum.TOP}
      fetch={async (req: GetCommentsForPostRequestDto) => {
        return await api.findCommentsForPost({
          getCommentsForPostRequestDto: req
        })
      }}
      KeyedComponent={({ arg }: ComponentArg<CommentDto>) => {
        return (
          <Comment
            comment={arg}
            ownsPost={ownsPost}
            decrementNumComments={decrementNumComments}
          />
        )
      }}
      loadingElement={
        <div className="flex w-full items-center justify-center">
          <span className="h-7 w-7 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
        </div>
      }
      fetchProps={{ postId }}
    ></InfiniteLoad>
  )
}
