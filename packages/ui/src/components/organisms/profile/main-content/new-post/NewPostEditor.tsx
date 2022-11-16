import { yupResolver } from "@hookform/resolvers/yup"
import {
  ContentDto,
  CreatePostRequestDto,
  PassDto,
  TagDto
} from "@passes/api-client"
import {
  MAX_PAID_POST_PRICE,
  MAX_PASSES_LIMIT,
  MIN_PAID_POST_PRICE,
  POST_TEXT_LENGTH
} from "@passes/shared-constants"
import classNames from "classnames"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { array, date, object } from "yup"

import { DragDrop } from "src/components/atoms/DragDrop"
import { CustomMentionEditor } from "src/components/organisms/CustomMentionEditor"
import { MediaSection } from "src/components/organisms/MediaSection"
import { NewPostEditorFooter } from "src/components/organisms/profile/new-post/NewPostEditorFooter"
import { NewPostEditorHeader } from "src/components/organisms/profile/new-post/NewPostEditorHeader"
import { ContentService } from "src/helpers/content"
import { yupPaid, yupTags } from "src/helpers/yup"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { useUser } from "src/hooks/useUser"
import { NewPostPaidSection } from "./NewPostPaidSection"

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
  previewIndex: number
}

const newPostFormDefaults: NewPostFormProps = {
  text: "",
  tags: [],
  files: [],
  isPaid: false,
  price: "",
  passes: [],
  expiresAt: null,
  scheduledAt: null,
  previewIndex: 0
}

const newPostFormSchema = object({
  ...yupPaid(
    "post",
    POST_TEXT_LENGTH,
    MIN_PAID_POST_PRICE,
    MAX_PAID_POST_PRICE,
    "Please add either text or media"
  ),
  ...yupTags("post"),
  passes: array<PassDto>()
    .optional()
    .max(
      MAX_PASSES_LIMIT,
      `You cannot have more than ${MAX_PASSES_LIMIT} passes in a posts`
    )
    .transform((p: PassDto) => p.passId),
  expiresAt: date().nullable(),
  scheduledAt: date().nullable()
})

interface NewPostEditorProps {
  handleSavePost: (
    arg: CreatePostRequestDto,
    contents: ContentDto[],
    passes: PassDto[],
    newContent: boolean
  ) => void | Promise<void>
  initialData: Partial<NewPostFormProps>
  onlyText?: boolean
  isExtended?: boolean
  onClose?: () => void
  popup: boolean
  title?: string
  schedulable?: boolean
  canEditPasses?: boolean
  showDefaultToast?: boolean
}

export const NewPostEditor: FC<NewPostEditorProps> = ({
  handleSavePost,
  initialData = {},
  onlyText = false,
  isExtended = false,
  popup,
  onClose,
  title = "New Post",
  schedulable = true,
  showDefaultToast = true,
  canEditPasses = true
}) => {
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia(
    initialData.files
  )
  const [extended, setExtended] = useState(isExtended)
  const [isReset, setIsReset] = useState(false)

  const [selectedPasses, setSelectedPasses] = useState<PassDto[]>(
    initialData.passes ?? []
  )
  const { user } = useUser()
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

  const previewIndex = watch("previewIndex")

  const onSubmit = async (values: NewPostFormProps) => {
    const files = values.files
    const contents = await new ContentService().uploadUserContentBare({
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
      contentIds: contents.map((content) => content.contentId),
      previewIndex: values.isPaid ? values.previewIndex : 0,
      expiresAt: values.expiresAt,
      scheduledAt: values.scheduledAt ?? undefined
    }

    await handleSavePost(
      post,
      contents.map((content) => {
        return { ...content, userId: user?.userId ?? "" }
      }),
      selectedPasses,
      files.some((file) => !!file.file)
    )

    if (showDefaultToast) {
      toast.dismiss()

      if (!values.scheduledAt) {
        toast.success("Your post has been created!")
      } else {
        toast.success(
          "Your post has been scheduled; go to the scheduler to view."
        )
      }
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
            title={title}
          />
        )}

        <DragDrop
          onChange={(event) => {
            addNewMedia(event.dataTransfer.files)
            if (!extended) {
              setExtended(true)
            }
          }}
        >
          {({ isDragging }) => (
            <div
              className={classNames(
                "w-full",
                {
                  "border-b border-[#2B282D] pb-6": extended
                },
                isDragging
                  ? "sm:border sm:border-dashed sm:border-passes-primary-color sm:backdrop-brightness-125"
                  : "sm:border sm:border-transparent",
                ""
              )}
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
                  mediaPreviewIndex={previewIndex}
                  onRemove={onRemove}
                  register={register}
                  setFiles={setFiles}
                  setMediaPreviewIndex={(index) => {
                    setValue("previewIndex", index)
                  }}
                />
              )}
            </div>
          )}
        </DragDrop>
        {extended && (
          <>
            {isPaid && (
              <NewPostPaidSection
                canEditPasses={canEditPasses}
                register={register}
                selectedPasses={selectedPasses}
                setSelectedPasses={setSelectedPasses}
              />
            )}
            <NewPostEditorFooter
              addContent={addContent}
              disableForm={disableForm}
              schedulable={schedulable}
              scheduledTime={getValues()?.scheduledAt}
              setScheduledTime={setScheduledTime}
            />
          </>
        )}
      </div>
    </form>
  )
}
