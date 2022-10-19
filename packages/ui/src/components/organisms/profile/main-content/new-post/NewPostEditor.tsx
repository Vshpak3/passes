import { CreatePostRequestDto, PassDto, TagDto } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { NewPostEditorFooter as NewPostEditorFooter } from "src/components/organisms/profile/new-post/PostFooter"
import { PostHeader } from "src/components/organisms/profile/new-post/PostHeader"
import { ContentService } from "src/helpers/content"

import { NewPostMediaSection } from "./NewPostMediaSection"
import { NewPostPaidSection } from "./NewPostPaidSection"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

export interface NewPostFormProps {
  expiresAt: Date | null
  isPaid: boolean
  tags: TagDto[]
  passes: PassDto[]
  price: string
  scheduledAt: Date | null
  text: string
}

interface NewPostEditorProps {
  handleSavePost: (arg: CreatePostRequestDto) => void | Promise<void>
  initialData: Record<string, any>
  onlyText?: boolean
  isExtended?: boolean
  onClose?: () => void
}

export const NewPostEditor: FC<NewPostEditorProps> = ({
  handleSavePost,
  initialData = {},
  onlyText = false,
  isExtended = false,
  onClose
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [extended, setExtended] = useState(isExtended)
  const [isReset, setIsReset] = useState(false)
  const [selectedPasses, setSelectedPasses] = useState<string[]>([])

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
    reset
  } = useForm<NewPostFormProps>({
    defaultValues: { ...initialData }
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const isPaid = watch("isPaid")

  const closeEditor = () => {
    setExtended(false)
    if (onClose) {
      onClose()
    }
  }

  const resetEditor = () => {
    reset()
    setFiles([])
    setIsReset(true)
  }

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const onSubmit = async () => {
    const values = getValues()

    if (values.text.length === 0 && files.length === 0) {
      toast.error("Must add either text or content")
      return
    }
    if (files.length === 0 && isPaid) {
      toast.error("You cannot create a paid post without media content")
      return
    }

    if (files.length > 0) {
      toast.info("Please wait a moment as your content is uploaded")
    }
    const contentIds = await new ContentService().uploadContent(
      files,
      undefined,
      {
        inPost: true,
        inMessage: false
      }
    )

    closeEditor()

    const post: CreatePostRequestDto = {
      text: values.text,
      tags: values.tags,
      passIds: selectedPasses,
      expiresAt: values.expiresAt,
      price: values.isPaid ? parseInt(values.price) : 0,
      contentIds,
      previewIndex: 0, // TODO: add previewing FE
      scheduledAt: values.scheduledAt ?? undefined
    }

    await handleSavePost(post)

    toast.dismiss()

    if (!values.scheduledAt) {
      toast.success("Your post has been created!")
    } else {
      toast.success(
        "Your post has been scheduled; go to the scheduler to view."
      )
    }

    resetEditor()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 p-5 backdrop-blur-[100px] md:px-7 md:py-5">
        {extended && (
          <>
            <PostHeader
              title="New post"
              onClose={closeEditor}
              register={register}
              errors={errors}
            />
          </>
        )}

        <div
          className={classNames("w-full", {
            "border-b border-[#2B282D] pb-6": extended
          })}
        >
          <div
            className={classNames({ "mt-4": extended }, "w-full")}
            onClick={() => {
              if (!extended) {
                setExtended(true)
              }
            }}
          >
            <CustomMentionEditor
              placeholder="What's on your mind?"
              defaultText={initialData.text}
              isReset={isReset}
              setIsReset={setIsReset}
              onInputChange={(params: any) => {
                setValue("text", params?.text)
                setValue("tags", params?.tags)
              }}
            />
          </div>
          {!onlyText && extended && (
            <NewPostMediaSection
              register={register}
              errors={errors}
              files={files}
              setFiles={setFiles}
            />
          )}
        </div>
        {extended && (
          <>
            {isPaid && (
              <NewPostPaidSection
                register={register}
                selectedPasses={selectedPasses}
                setSelectedPasses={setSelectedPasses}
              />
            )}
            <NewPostEditorFooter
              disableForm={disableForm}
              setScheduledTime={setScheduledTime}
              scheduledTime={getValues()?.scheduledAt}
            />
          </>
        )}
      </div>
    </form>
  )
}
