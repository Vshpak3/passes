import { CommentApi, CommentDto } from "@passes/api-client"
import React, { FC, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import CustomComponentMentionEditor from "src/components/organisms/CustomMentionEditor"
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
      onSubmit={onSubmit}
      className="flex w-full flex-row items-center pt-5"
    >
      <div className="hide-scroll block w-full resize-none overflow-auto overflow-y-visible rounded-lg border border-white/50 bg-black/10 p-4 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]">
        <CustomComponentMentionEditor
          isReset={isReset}
          setIsReset={setIsReset}
          placeholder="Type a comment..."
          onInputChange={(params: any) => {
            setIsButtonDisabled(!params?.text)
            setValue("comment", params?.text)
            setValue("mentions", params?.tags)
          }}
        />
      </div>
      <Button
        tag="button"
        variant="pink"
        disabled={isButtonDisabled || isSubmitting}
        className="ml-4 h-[40px] w-[96px] shrink-0"
      >
        Comment
      </Button>
    </form>
  )
}
