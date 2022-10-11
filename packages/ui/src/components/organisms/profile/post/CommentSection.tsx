import {
  CommentDto,
  GetCommentsForPostRequestDto,
  GetCommentsForPostResponseDto
} from "@passes/api-client"
import { CommentApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "src/components/atoms/Button"
import { ComponentArg, InfiniteLoad } from "src/components/atoms/InfiniteLoad"
import CustomComponentMentionEditor from "src/components/organisms/CustomMentionEditor"
import { Comment } from "src/components/organisms/profile/post/Comment"
import { errorMessage } from "src/helpers/error"
interface CommentSectionProps {
  postId: string
  ownsPost: boolean
  visible: boolean
  updateEngagement: any
}

const api = new CommentApi()
export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  visible = false,
  updateEngagement,
  ownsPost
}) => {
  const [isReset, setIsReset] = useState(false)
  const {
    getValues,
    setValue,
    formState: { isSubmitSuccessful }
  } = useForm()
  const [resets, setResets] = useState<number>(0)

  async function postComment() {
    try {
      const text = getValues("comment")
      const tags = getValues("mentions")
      if (text.length === 0) {
        return
      }

      await api.createComment({
        createCommentRequestDto: {
          text,
          tags,
          postId
        }
      })

      setResets(resets + 1)
      setIsReset(true)
      updateEngagement()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <div
      className={classNames(
        "mt-10 flex w-full flex-col border-t-[1px] border-t-gray-300/10",
        !visible ? "hidden" : ""
      )}
    >
      <InfiniteLoad<CommentDto, GetCommentsForPostResponseDto>
        fetch={async (req: GetCommentsForPostRequestDto) => {
          setTimeout(() => undefined, 500)
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
        resets={resets}
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
