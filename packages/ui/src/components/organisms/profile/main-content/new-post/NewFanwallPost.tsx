import { CreateFanWallCommentRequestDto } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { PostHeader } from "src/components/organisms/profile/new-post/PostHeader"
import { useCreatorProfile } from "src/hooks/useCreatorProfile"
import { useFanWall } from "src/hooks/useFanWall"

const CustomMentionEditor = dynamic(
  () =>
    import("src/components/organisms/CustomMentionEditor").then(
      (m) => m.CustomComponentMentionEditor
    ),
  { ssr: false }
)

interface NewPostFormProps {
  mentions: any[] // TODO
  text: string
}

export const NewFanwallPost: FC = () => {
  const { profile } = useCreatorProfile()
  const { writeToFanWall } = useFanWall(profile?.userId || "")
  const [extended, setExtended] = useState(false)
  const [isReset, setIsReset] = useState(false)

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    reset
  } = useForm<NewPostFormProps>({
    defaultValues: {}
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const onSubmit = async () => {
    const values = getValues()
    setExtended(false)

    const post: Omit<CreateFanWallCommentRequestDto, "creatorId"> = {
      text: values.text,
      tags: [] // TODO: add in values.mentions (must update to be TagDto)
    }

    await writeToFanWall(post as CreateFanWallCommentRequestDto)
    reset()
    setIsReset(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-2 py-2 backdrop-blur-[100px] md:px-7 md:py-5">
        {extended && (
          <>
            <PostHeader onClose={() => setExtended(false)} />
          </>
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
                profile?.displayName ? ` to ${profile?.displayName}...` : "..."
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
