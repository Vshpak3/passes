import {
  CommentApi,
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
  PostDto
} from "@passes/api-client"
import React, { FC, memo } from "react"
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
  decrementNumComments: () => void
}

const api = new CommentApi()

const CommentFeedUnmemo: FC<CommentFeedProps> = ({
  postId,
  ownsPost,
  decrementNumComments
}) => {
  return (
    <InfiniteLoad<CommentDto, GetCommentsForPostResponseDto>
      keyValue={`/comments/${postId}`}
      fetch={async (req: GetCommentsForPostRequestDto) => {
        return await api.findCommentsForPost({
          getCommentsForPostRequestDto: req
        })
      }}
      fetchProps={{ postId }}
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
      loadMoreMessage="Load previous comments"
      loadMorePosition={LoadMsgPositionEnum.BOTTOM}
      options={{
        revalidateOnMount: false,
        revalidateAll: false,
        revalidateFirstPage: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
      }}
    />
  )
}

export const CommentFeed = memo(CommentFeedUnmemo)
