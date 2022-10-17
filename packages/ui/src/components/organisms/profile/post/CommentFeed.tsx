import {
  CommentApi,
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto,
  ListMemberDto,
  PostDto
} from "@passes/api-client"
import React from "react"
import { InfiniteLoad } from "src/components/atoms/InfiniteLoad"
import { ComponentArg } from "src/components/atoms/InfiniteScroll"

import { Comment } from "./Comment"

interface CommentFeedProps {
  postId: PostDto["postId"]
  ownsPost: PostDto["isOwner"]
  isCreator?: boolean
  blockedUsers?: ListMemberDto[]
}

const api = new CommentApi()

export const CommentFeed: React.FC<CommentFeedProps> = ({
  postId,
  ownsPost,
  isCreator,
  blockedUsers
}) => {
  return (
    <InfiniteLoad<CommentDto, GetCommentsForPostResponseDto>
      keyValue={`/comments/${postId}`}
      isReverse
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
            isCreator={isCreator}
            blockedUsers={blockedUsers}
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
