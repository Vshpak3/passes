import { yupResolver } from "@hookform/resolvers/yup"
import { CreatePostRequestDto, PassDto, TagDto } from "@passes/api-client"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { MediaSection } from "src/components/organisms/MediaSection"
import { NewPostEditorFooter } from "src/components/organisms/profile/new-post/NewPostEditorFooter"
import { NewPostEditorHeader } from "src/components/organisms/profile/new-post/NewPostEditorHeader"
import { MAX_PAID_POST_PRICE, MIN_PAID_POST_PRICE } from "src/config/post"
import { ContentService } from "src/helpers/content"
import { useFormSubmitTimeout } from "src/hooks/useFormSubmitTimeout"
import { ContentFile, useMedia } from "src/hooks/useMedia"
import { array, bool, date, number, object, string } from "yup"

import { NewPostPaidSection } from "./NewPostPaidSection"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

export interface NewPostFormProps {
  text: string
  tags: TagDto[]
  files: ContentFile[]
  isPaid: boolean
  price: number
  passes: PassDto[]
  expiresAt: Date | null
  scheduledAt: Date | null
}

const newPostFormDefaults: NewPostFormProps = {
  text: "",
  tags: [],
  files: [],
  isPaid: false,
  price: 0,
  passes: [],
  expiresAt: null,
  scheduledAt: null
}

const newPostFormSchema = object({
  text: string()
    .optional()
    .transform((defaultText) => defaultText.trim())
    .when("files", {
      is: (f: File[]) => f.length === 0,
      then: string().required("Must add either text or content")
    }),
  tags: array<TagDto>().optional(),
  files: array<File>().when("isPaid", {
    is: true,
    then: array().min(1, "You cannot create a paid post without media content")
  }),
  isPaid: bool().optional(),
  price: number()
    .optional()
    .integer()
    .when("isPaid", {
      is: true,
      then: number()
        .required("A price must be set for a paid post")
        .min(
          MIN_PAID_POST_PRICE,
          `The minimum price of a post is $${MIN_PAID_POST_PRICE}`
        )
        .max(
          MAX_PAID_POST_PRICE,
          `The maxinum price of a post is $${MAX_PAID_POST_PRICE}`
        )
    }),
  passes: array<PassDto>()
    .optional()
    .transform((p: PassDto) => p.passId),
  expiresAt: date().nullable(),
  scheduledAt: date().nullable()
})

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
  const { files, setFiles, addNewMedia, onRemove, addContent } = useMedia()
  const [extended, setExtended] = useState(isExtended)
  const [isReset, setIsReset] = useState(false)
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

    if (values.files.length > 0) {
      toast.info("Please wait a moment as your content is uploaded")
    }
    const contentIds = await new ContentService().uploadContent(
      values.files,
      undefined,
      {
        inPost: true,
        inMessage: false
      }
    )

    closeEditor()

    // Ensure to check isPaid so if the drop down is closed we clear the values
    const post: CreatePostRequestDto = {
      text: values.text,
      tags: values.tags,
      passIds: values.isPaid ? selectedPasses.map((pass) => pass.passId) : [],
      price: values.isPaid ? parseInt(values.price as unknown as string) : 0,
      contentIds,
      previewIndex: 0, // TODO: add previewing FE
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
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[15px] border border-[#ffffff]/10 bg-[#1b141d]/50 p-5 backdrop-blur-[100px] md:px-7 md:py-5">
        {extended && (
          <>
            <NewPostEditorHeader
              title="New post"
              formName="isPaid"
              onClose={closeEditor}
              register={register}
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
              onInputChange={(
                params: Pick<NewPostFormProps, "text" | "tags">
              ) => {
                setValue("text", params?.text)
                setValue("tags", params?.tags)
              }}
            />
          </div>
          {!onlyText && extended && (
            <MediaSection
              register={register}
              errors={errors}
              files={files}
              onRemove={onRemove}
              addNewMedia={addNewMedia}
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
              addContent={addContent}
            />
          </>
        )}
      </div>
    </form>
  )
}
