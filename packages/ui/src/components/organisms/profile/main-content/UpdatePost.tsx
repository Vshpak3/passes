import { CreatePostRequestDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { PostFooter } from "src/components/organisms/profile/new-post/PostFooter"
import { useScheduledPosts } from "src/hooks/useScheduledPosts"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

interface UpdatePostFormProps {
  mentions: any[] // TODO
  scheduledAt: Date | null
  text: string
}

interface UpdatePostProps {
  postId: string
  initialData?: Partial<UpdatePostFormProps>
  onUpdate?: () => void
  onClose?: () => void
}

export const UpdatePost: FC<UpdatePostProps> = ({
  postId,
  initialData = {},
  onUpdate,
  onClose
}) => {
  const [isReset, setIsReset] = useState(false)
  const { updatePost } = useScheduledPosts()

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
    reset
  } = useForm<UpdatePostFormProps>({
    defaultValues: { ...initialData }
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const onSubmit = async () => {
    const values = getValues()
    if (values.text.length === 0) {
      toast.error("Must add either text")
      return
    }

    const post: Pick<CreatePostRequestDto, "text" | "scheduledAt" | "tags"> = {
      tags: [], // TODO: add in values.mentions (must update to be TagDto)
      text: values.text,
      scheduledAt: values.scheduledAt
    }

    updatePost(postId, post)

    onUpdate && onUpdate()
    reset()
    setIsReset(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 p-5 backdrop-blur-[100px] md:px-7 md:py-5">
        <div className="relative flex w-full items-center space-x-4 border-b border-[#2B282D] pb-4 text-[16px] font-normal">
          <button onClick={onClose} type="button">
            <CloseIcon />
          </button>
          <h4 className="text-xl font-bold leading-4">Update Post</h4>
        </div>

        <div className="w-full border-b border-[#2B282D] pb-6">
          <div className="mt-4 w-full">
            <CustomMentionEditor
              defaultText={initialData?.text || ""}
              isReset={isReset}
              setIsReset={setIsReset}
              onInputChange={(params: any) => {
                setValue("text", params?.text)
                setValue("mentions", params?.mentions)
              }}
            />
          </div>
        </div>
        <PostFooter
          disableForm={disableForm}
          setScheduledTime={setScheduledTime}
          scheduledTime={watch()?.scheduledAt}
        />
      </div>
    </form>
  )
}
