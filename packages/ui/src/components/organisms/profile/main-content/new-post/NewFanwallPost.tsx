import { CreateFanWallCommentRequestDto, FanWallApi } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { useProfile } from "src/hooks/profile/useProfile"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

interface NewFanwallPostProps {
  createPost: (
    arg: CreateFanWallCommentRequestDto,
    fanWallCommentId: string
  ) => void | Promise<void>
  creatorId: string
}
interface NewFanwallPostFormProps {
  mentions: any[] // TODO
  text: string
}

export const NewFanwallPost: FC<NewFanwallPostProps> = ({
  createPost,
  creatorId
}: NewFanwallPostProps) => {
  const { profileInfo } = useProfile()
  const [extended, setExtended] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    reset
  } = useForm<NewFanwallPostFormProps>({
    defaultValues: {}
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const onSubmit = async () => {
    const values = getValues()
    setExtended(false)

    const post: CreateFanWallCommentRequestDto = {
      creatorId,
      text: values.text,
      tags: [] // TODO: add in values.mentions (must update to be TagDto)
    }
    const api = new FanWallApi()
    const fanWallCommentId = (
      await api.createFanWallComment({
        createFanWallCommentRequestDto: post
      })
    ).fanWallCommentId
    await createPost(post, fanWallCommentId)
    reset()
    setIsReset(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 p-5 backdrop-blur-[100px] md:px-7 md:py-5">
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
              setIsReset={setIsReset}
              placeholder={`Write something${
                profileInfo?.displayName
                  ? ` to ${profileInfo?.displayName}...`
                  : "..."
              }`}
              onInputChange={(params: any) => {
                setValue("text", params?.text)
                setValue("mentions", params?.mentions)
              }}
            />
          </div>
        </div>
        {extended && (
          <button
            type="submit"
            disabled={disableForm}
            className="mt-4 ml-auto flex items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90"
          >
            Post
          </button>
        )}
      </div>
    </form>
  )
}
