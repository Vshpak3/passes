import { yupResolver } from "@hookform/resolvers/yup"
import { CommentApi, CommentDto } from "@passes/api-client"
import { FC, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import CustomComponentMentionEditor from "src/components/organisms/CustomMentionEditor"
import { NewPostTextFormProps } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { MAX_COMMENT_TEXT_LENGTH } from "src/config/post"
import { errorMessage } from "src/helpers/error"
import { yupPostText, yupTags } from "src/helpers/yup"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { useUser } from "src/hooks/useUser"

const newCommentFormSchema = object({
  ...yupPostText(MAX_COMMENT_TEXT_LENGTH, "comment"),
  ...yupTags("comment")
})

interface NewCommentProps {
  postId: string
  addComment: (comment: CommentDto) => void
}

export const NewCommentEditor: FC<NewCommentProps> = ({
  postId,
  addComment
}) => {
  const { user } = useUser()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const {
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<NewPostTextFormProps>({
    resolver: yupResolver(newCommentFormSchema)
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  useEffect(() => {
    // Any time we receive an error, just show the first one
    const errorMessages = Object.entries(errors).map((e) => e[1].message)
    if (errorMessages.length) {
      toast.error(errorMessages[0])
    }
  }, [errors])

  const postComment = useCallback(async () => {
    if (!user) {
      return
    }

    const api = new CommentApi()
    try {
      const { commentId } = await api.createComment({
        createCommentRequestDto: {
          postId,
          ...getValues()
        }
      })

      const comment: CommentDto = {
        commentId,
        postId,
        ...getValues(),
        commenterDisplayName: user.displayName,
        commenterId: user.userId,
        commenterIsCreator: !!user.isCreator,
        commenterUsername: user.username,
        createdAt: new Date(),
        isHidden: false,
        isOwner: true
      }

      addComment(comment)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }, [getValues, postId, addComment, user])

  const onSubmit = async () => {
    await postComment()
    reset()
    setIsReset(true)
  }

  return (
    <form
      className="flex w-full flex-col items-center gap-2 pt-5 md:flex-row md:gap-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible rounded-[5px] border border-passes-gray bg-black/10 p-4">
        <CustomComponentMentionEditor
          isReset={isReset}
          onInputChange={(params: NewPostTextFormProps) => {
            setIsButtonDisabled(!params?.text)
            setValue("text", params?.text)
            setValue("tags", params?.tags)
          }}
          placeholder="Type a comment..."
          setIsReset={setIsReset}
        />
      </div>
      <Button
        className="h-[40px] w-full shrink-0 md:ml-4 md:w-[96px]"
        disabled={isButtonDisabled || disableForm}
        type={ButtonTypeEnum.SUBMIT}
      >
        Comment
      </Button>
    </form>
  )
}
