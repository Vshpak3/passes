import {
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto
} from "@passes/api-client"
import { CommentApi } from "@passes/api-client/apis"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "src/components/atoms/Button"
import { InfiniteLoad } from "src/components/atoms/InfiniteLoad"
import { ComponentArg } from "src/components/atoms/InfiniteScroll"
import CustomComponentMentionEditor from "src/components/organisms/CustomMentionEditor"
import { Comment } from "src/components/organisms/profile/post/Comment"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"

const api = new CommentApi()

interface CommentSectionProps {
  postId: string
  ownsPost: boolean
  updateEngagement: any
}

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  updateEngagement,
  ownsPost
}) => {
  const [comments, setComments] = useState<CommentDto[]>([])
  const [isReset, setIsReset] = useState(false)
  const {
    getValues,
    setValue,
    formState: { isSubmitSuccessful }
  } = useForm()
  const { user } = useUser()

  async function postComment() {
    try {
      const text = getValues("comment")
      const tags = getValues("mentions")
      if (text.length === 0) {
        return
      }

      const commentId = (
        await api.createComment({
          createCommentRequestDto: {
            text,
            tags,
            postId
          }
        })
      ).commentId

      const comment: CommentDto = {
        commentId,
        postId,
        text,
        tags,
        commenterId: user?.userId ?? "",
        commenterDisplayName: user?.displayName ?? "",
        commenterUsername: user?.username ?? "",
        createdAt: new Date(),
        isHidden: false,
        isOwner: true
      }
      setComments([comment, ...comments])
      setIsReset(true)
      updateEngagement()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

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

      <form
        onSubmit={(e) => {
          e.preventDefault()
          postComment()
        }}
        className="flex w-full flex-row items-center pt-5"
      >
        <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible rounded-lg border border-white/50 bg-black/10 p-4 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]">
          <CustomComponentMentionEditor
            isReset={isReset}
            setIsReset={setIsReset}
            placeholder="Type a comment..."
            onInputChange={(params: any) => {
              setValue("comment", params?.text)
              setValue("mentions", params?.mentions)
            }}
          />
        </div>
        <Button
          tag="button"
          variant="pink"
          disabled={isSubmitSuccessful}
          className="ml-4 h-[40px] w-[10%] min-w-[70px]"
        >
          Comment
        </Button>
      </form>
    </div>
  )
}
