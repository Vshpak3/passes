import { CommentApi, CommentDto } from "@passes/api-client"
import React, { FC, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import CustomComponentMentionEditor from "src/components/organisms/CustomMentionEditor"
import { NewPostTextFormProps } from "src/components/organisms/profile/main-content/new-post/NewPostEditor"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"

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
    getValues,
    setValue,
    formState: { isSubmitting }
  } = useForm()

  const postComment = useCallback(async () => {
    const text = getValues("comment")
    const tags = getValues("mentions")

    if (!user) {
      return
    }

    const api = new CommentApi()
    try {
      const { commentId } = await api.createComment({
        createCommentRequestDto: {
          postId,
          text,
          tags
        }
      })

      const comment: CommentDto = {
        commentId,
        postId,
        text,
        tags,
        commenterId: user.userId,
        commenterDisplayName: user.displayName,
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

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement> | globalThis.KeyboardEvent) => {
      e.preventDefault()
      postComment()
      setIsReset(true)
    },
    [postComment]
  )

  // Enable user to publish comment via ctrl + enter
  useEffect(() => {
    const keyDownHandler = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        onSubmit(event)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [onSubmit])

  return (
    <form
      className="flex w-full flex-col items-center gap-2 pt-5 md:flex-row md:gap-0"
      onSubmit={onSubmit}
    >
      <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible border border-white/50 bg-black/10 p-4 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]">
        <CustomComponentMentionEditor
          isReset={isReset}
          onInputChange={(params: NewPostTextFormProps) => {
            setIsButtonDisabled(!params?.text)
            setValue("comment", params?.text)
            setValue("mentions", params?.tags)
          }}
          placeholder="Type a comment..."
          setIsReset={setIsReset}
        />
      </div>
      <Button
        className="h-[40px] w-full shrink-0 md:ml-4 md:w-[96px]"
        disabled={isButtonDisabled || isSubmitting}
        tag="button"
        variant="pink"
      >
        Comment
      </Button>
    </form>
  )
}
