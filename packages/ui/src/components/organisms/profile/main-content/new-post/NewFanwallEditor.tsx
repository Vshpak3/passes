import { yupResolver } from "@hookform/resolvers/yup"
import { CreateFanWallCommentRequestDto, FanWallApi } from "@passes/api-client"
import { FAN_COMMENT_TEXT_LENGTH } from "@passes/shared-constants"
import classNames from "classnames"
import CloseIcon from "public/icons/sidebar/close.svg"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { CustomMentionEditor } from "src/components/organisms/CustomMentionEditor"
import { errorMessage } from "src/helpers/error"
import { yupPostText, yupTags } from "src/helpers/yup"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { NewPostTextFormProps } from "./NewPostEditor"

const newFallWallFormSchema = object({
  ...yupPostText(FAN_COMMENT_TEXT_LENGTH, "fan wall comment"),
  ...yupTags("fan wall comment")
})

interface NewFanwallEditorProps {
  createFanWallPost: (
    arg: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => void | Promise<void>
  creatorId: string
}

export const NewFanwallEditor: FC<NewFanwallEditorProps> = ({
  createFanWallPost,
  creatorId
}) => {
  // const { profile } = useContext(ProfileContext)
  const [extended, setExtended] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    reset
  } = useForm<NewPostTextFormProps>({
    resolver: yupResolver(newFallWallFormSchema)
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  useEffect(() => {
    // Any time we receive an error, just show the first one
    const errorMessages = Object.entries(errors).map((e) => e[1].message)
    if (errorMessages.length) {
      toast.error(errorMessages[0])
    }
  }, [errors])

  const postFanWallComment = async (values: NewPostTextFormProps) => {
    const post: CreateFanWallCommentRequestDto = {
      creatorId,
      ...values
    }
    const api = new FanWallApi()
    try {
      const fanWallCommentId = (
        await api.createFanWallComment({
          createFanWallCommentRequestDto: post
        })
      ).fanWallCommentId
      await createFanWallPost(post, fanWallCommentId)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const onSubmit = async (values: NewPostTextFormProps) => {
    await postFanWallComment(values)
    setExtended(false)
    reset()
    setIsReset(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start justify-start border-y-[1px] border-passes-gray p-5 md:px-7 md:py-5">
        {extended && (
          <div className="w-full border-b border-[#2B282D] pb-4">
            <button onClick={() => setExtended(false)} type="button">
              <CloseIcon />
            </button>
          </div>
        )}

        <div
          className={classNames("w-full", {
            "border-b border-[#2B282D] pb-6": extended
          })}
        >
          <div
            className={classNames({ "mt-4": extended }, "w-full")}
            onClick={() => setExtended(true)}
          >
            <CustomMentionEditor
              isReset={isReset}
              onInputChange={(params: NewPostTextFormProps) => {
                setIsButtonDisabled(!params?.text)
                setValue("text", params?.text)
                setValue("tags", params?.tags)
              }}
              placeholder="Leave a comment ..." // removed `to ...` due to overflow issues with log names
              setIsReset={setIsReset}
            />
          </div>
        </div>
        {extended && (
          <Button
            className="mt-4 ml-auto flex items-center justify-center bg-passes-pink-100 py-[10px] px-[20px] text-base font-bold text-white/90"
            disabled={isButtonDisabled || disableForm}
            fontSize={16}
            type={ButtonTypeEnum.SUBMIT}
          >
            Comment
          </Button>
        )}
      </div>
    </form>
  )
}
