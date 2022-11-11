import { yupResolver } from "@hookform/resolvers/yup"
import { CreateFanWallCommentRequestDto, FanWallApi } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import CloseIcon from "public/icons/sidebar/close.svg"
import { FC, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { object } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { MAX_FAN_COMMENT_TEXT_LENGTH } from "src/config/post"
import { yupPostText, yupTags } from "src/helpers/yup"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { ProfileContext } from "src/pages/[username]"
import { NewPostTextFormProps } from "./NewPostEditor"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

const newFallWallFormSchema = object({
  ...yupPostText(MAX_FAN_COMMENT_TEXT_LENGTH, "fan wall comment"),
  ...yupTags("fan wall comment")
})

interface NewFanwallPostProps {
  createFanWallPost: (
    arg: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => void | Promise<void>
  creatorId: string
}

export const NewFanwallPost: FC<NewFanwallPostProps> = ({
  createFanWallPost,
  creatorId
}) => {
  const { profile } = useContext(ProfileContext)
  const [extended, setExtended] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    reset
  } = useForm<NewPostTextFormProps>({
    resolver: yupResolver(newFallWallFormSchema)
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const onSubmit = async () => {
    setExtended(false)

    const post: CreateFanWallCommentRequestDto = {
      creatorId,
      ...getValues()
    }
    const api = new FanWallApi()
    const fanWallCommentId = (
      await api.createFanWallComment({
        createFanWallCommentRequestDto: post
      })
    ).fanWallCommentId
    await createFanWallPost(post, fanWallCommentId)
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
                setValue("text", params?.text)
                setValue("tags", params?.tags)
              }}
              placeholder={`Write something${
                profile?.displayName ? ` to ${profile?.displayName}...` : "..."
              }`}
              setIsReset={setIsReset}
            />
          </div>
        </div>
        {extended && (
          <Button
            className="mt-4 ml-auto flex items-center justify-center bg-passes-pink-100 py-[10px] px-[20px] text-base font-bold text-[#ffffff]/90"
            disabled={disableForm}
            fontSize={16}
            type={ButtonTypeEnum.SUBMIT}
          >
            Post
          </Button>
        )}
      </div>
    </form>
  )
}
