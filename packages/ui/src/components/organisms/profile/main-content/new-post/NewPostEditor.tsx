import { yupResolver } from "@hookform/resolvers/yup"
import { CreatePostRequestDto, PassDto, TagDto } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { array, date, object } from "yup"

import { MediaSection } from "src/components/organisms/MediaSection"
import { NewPostEditorFooter } from "src/components/organisms/profile/new-post/NewPostEditorFooter"
import { NewPostEditorHeader } from "src/components/organisms/profile/new-post/NewPostEditorHeader"
import { MAX_PAID_POST_PRICE, MIN_PAID_POST_PRICE } from "src/config/post"
import { ContentService } from "src/helpers/content"
import { yupPaid } from "src/helpers/yup"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { NewPostPaidSection } from "./NewPostPaidSection"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

export interface NewPostTextFormProps {
  text: string
  tags: TagDto[]
}

export interface NewPostFormProps extends NewPostTextFormProps {
  files: ContentFile[]
  isPaid: boolean
  price: string
  passes: PassDto[]
  expiresAt: Date | null
  scheduledAt: Date | null
}

const newPostFormDefaults: NewPostFormProps = {
  text: "",
  tags: [],
  files: [],
  isPaid: false,
  price: "",
  passes: [],
  expiresAt: null,
  scheduledAt: null
}

const newPostFormSchema = object({
  ...yupPaid(
    "post",
    MIN_PAID_POST_PRICE,
    MAX_PAID_POST_PRICE,
    "Must add either text or content"
  ),
  tags: array<TagDto>().optional(),
  passes: array<PassDto>()
    .optional()
    .transform((p: PassDto) => p.passId),
  expiresAt: date().nullable(),
  scheduledAt: date().nullable()
})

interface NewPostEditorProps {
  handleSavePost: (arg: CreatePostRequestDto) => void | Promise<void>
  initialData: Partial<NewPostFormProps>
  onlyText?: boolean
  isExtended?: boolean
  onClose?: () => void
  popup: boolean
}

export const NewPostEditor: FC<NewPostEditorProps> = ({
  handleSavePost,
  initialData = {},
  onlyText = false,
  isExtended = false,
  popup,
  onClose
}) => {
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia()
  const [extended, setExtended] = useState(isExtended)
  const [isReset, setIsReset] = useState(false)
  const [mediaPreviewIndex, setMediaPreviewIndex] = useState(0)
  const [selectedPasses, setSelectedPasses] = useState<PassDto[]>([])
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
    reset
  } = useForm<NewPostFormProps>({
    defaultValues: { ...newPostFormDefaults, ...initialData },
    resolver: yupResolver(newPostFormSchema)
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const isPaid = watch("isPaid")

  useEffect(() => {
    setValue("files", files, { shouldValidate: true })
  }, [files, setValue])

  useEffect(() => {
    setValue("passes", selectedPasses, { shouldValidate: true })
  }, [selectedPasses, setValue])

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const closeEditor = () => {
    setExtended(false)
    reset()
    setFiles([])
    setSelectedPasses([])
    setIsReset(true)
    if (onClose) {
      onClose()
    }
  }

  const resetEditor = () => {
    reset()
    setFiles([])
    setSelectedPasses([])
    setIsReset(true)
  }

  useEffect(() => {
    // Any time we receive an error, just show the first one
    const errorMessages = Object.entries(errors).map((e) => e[1].message)
    if (errorMessages.length) {
      toast.error(errorMessages[0])
    }
  }, [errors])

  const onSubmit = async () => {
    const values = getValues()
    const contentIds = await new ContentService().uploadUserContent({
      files: values.files,
      inPost: true
    })

    closeEditor()

    // Ensure to check isPaid so if the drop down is closed we clear the values
    const post: CreatePostRequestDto = {
      text: values.text,
      tags: values.tags,
      passIds: values.isPaid ? selectedPasses.map((pass) => pass.passId) : [],
      price: values.isPaid ? parseFloat(values.price) : 0,
      contentIds,
      previewIndex: values.isPaid ? mediaPreviewIndex : 0,
      expiresAt: values.expiresAt,
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
      <div
        className={classNames(
          "flex flex-col items-start justify-start border-passes-gray p-5 md:px-7 md:py-5",
          popup
            ? "border border-[#ffffff3b] bg-passes-black"
            : "border-y-[0.5px]"
        )}
      >
        {extended && (
          <NewPostEditorHeader
            formName="isPaid"
            onClose={closeEditor}
            register={register}
            title="New post"
          />
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
              defaultText={initialData.text}
              isReset={isReset}
              onInputChange={(params: NewPostTextFormProps) => {
                setValue("text", params?.text)
                setValue("tags", params?.tags)
              }}
              placeholder="What's on your mind?"
              setIsReset={setIsReset}
            />
          </div>
          {!onlyText && extended && (
            <MediaSection
              addNewMedia={addNewMedia}
              errors={errors}
              files={files}
              isPaid={isPaid}
              mediaPreviewIndex={mediaPreviewIndex}
              onRemove={onRemove}
              register={register}
              setFiles={setFiles}
              setMediaPreviewIndex={setMediaPreviewIndex}
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
              addContent={addContent}
              disableForm={disableForm}
              scheduledTime={getValues()?.scheduledAt}
              setScheduledTime={setScheduledTime}
            />
          </>
        )}
      </div>
    </form>
  )
}
