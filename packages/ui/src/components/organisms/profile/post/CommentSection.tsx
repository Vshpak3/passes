import { CommentDto } from "@passes/api-client"
import { CommentApi } from "@passes/api-client/apis"
import classNames from "classnames"
import { FC, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "src/components/atoms"
import { CustomMentionEditor } from "src/components/organisms"
import { Comment } from "src/components/organisms/profile/post/Comment"
import { errorMessage } from "src/helpers/error"

interface CommentSectionProps {
  postId: string
  visible: boolean
  updateEngagement: any
}

export const CommentSection: FC<CommentSectionProps> = ({
  postId = "",
  visible = false,
  updateEngagement
}) => {
  const [isLoadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState<CommentDto[]>([])
  const [isReset, setIsReset] = useState(false)
  const {
    getValues,
    setValue,
    formState: { isSubmitSuccessful }
  } = useForm()

  const getComments = useCallback(
    async (withLoadingState = true) => {
      try {
        if (withLoadingState) {
          setLoadingComments(true)
        }
        const api = new CommentApi()

        const response = await api.findCommentsForPost({
          getCommentsForPostRequestDto: {
            postId
          }
        })

        setComments(response.data)
      } catch (error: any) {
        errorMessage(error, true)
      } finally {
        setLoadingComments(false)
      }
    },
    [postId]
  )

  useEffect(() => {
    if (visible) {
      getComments()
    }
  }, [getComments, visible])

  async function postComment() {
    try {
      const text = getValues("comment")
      const tags = getValues("mentions")
      if (text.length === 0) {
        return
      }

      const api = new CommentApi()

      await api.createComment({
        createCommentRequestDto: {
          text,
          tags,
          postId
        }
      })

      setValue("comment", "")
      getComments(false)
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
      {isLoadingComments ? (
        <div className="flex w-full items-center justify-center">
          <span className="h-7 w-7 animate-spin rounded-[50%] border-4 border-t-4 border-gray-400 border-t-white" />
        </div>
      ) : (
        comments.map((comment: CommentDto) => (
          <Comment key={comment.commentId} comment={comment} />
        ))
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          postComment()
        }}
        className="flex w-full flex-row items-center pt-5"
      >
        <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible rounded-lg border border-white/50 bg-black/10 p-4 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]">
          <CustomMentionEditor
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
          Post
        </Button>
      </form>
    </div>
  )
}
