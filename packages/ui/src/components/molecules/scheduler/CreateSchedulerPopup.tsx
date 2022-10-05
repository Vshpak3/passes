import { CreatePostRequestDto } from "@passes/api-client"
import { format } from "date-fns"
import CalendarIcon from "public/icons/calendar-icon.svg"
import ClockIcon from "public/icons/clock-icon.svg"
import { forwardRef, useCallback, useState } from "react"
import CalendarPicker from "src/components/molecules/scheduler/CalendarPicker"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/organisms/profile/main-content/new-post"
import { useCreatePost } from "src/hooks"
interface CreateSchedulerPopupProps {
  onCancel: () => void
}

const CreateSchedulerPopup = forwardRef<
  HTMLDivElement,
  CreateSchedulerPopupProps
>((props, ref) => {
  const { onCancel } = props
  const [selectionDate, setSelectionDate] = useState<Date | null>(null)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const { createPost } = useCreatePost()

  const handleSaveTime = useCallback((date: Date | null) => {
    if (date) {
      setSelectionDate(date)
    }
  }, [])

  const handleCreatePost = (values: CreatePostRequestDto) => {
    createPost({ ...values })
    setIsNewPostModalOpen(false)
  }

  return (
    <div ref={ref} className="flex w-[450px] flex-col">
      <span className="mb-4 text-base font-medium leading-6 text-white">
        Create Schedule Post
      </span>
      <p className="mb-4 text-base font-normal leading-6 text-passes-secondary-color">
        Please choose a date and time for your action to be executed.
      </p>
      <CalendarPicker onSave={handleSaveTime}>
        <div className="flex items-center gap-4">
          <div className="relative flex h-[45px] flex-1 items-center rounded-md border border-passes-dark-200 bg-passes-dark-700 p-2 text-white">
            <span>
              {selectionDate ? format(selectionDate, "MM/dd/yyyy") : ""}
            </span>
            <span className="absolute right-[10px]">
              <CalendarIcon />
            </span>
          </div>
          <div className="relative flex h-[45px] flex-1 items-center rounded-md border border-passes-dark-200 bg-passes-dark-700 p-2 text-white">
            <span>{`${
              selectionDate ? format(selectionDate, "hh:mm a") : ""
            }`}</span>
            <span className="absolute right-[10px]">
              <ClockIcon />
            </span>
          </div>
        </div>
      </CalendarPicker>
      <div className="mt-7 flex items-end justify-end">
        <button
          onClick={onCancel}
          className="mr-[10px] rounded-[50px] bg-passes-dark-500 py-[10px] px-[21px] font-bold text-white"
        >
          Cancel
        </button>
        <NewPostDialog
          open={isNewPostModalOpen}
          triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-8"
          className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
          onTriggerClick={() => onCancel()}
          trigger={
            <button className="rounded-[50px] bg-passes-primary-color py-[10px] px-[21px] font-bold text-white">
              Create
            </button>
          }
        >
          <NewPost
            passes={[]}
            initScheduledTime={selectionDate}
            createPost={handleCreatePost}
            placeholder="What's on your mind?"
          />
        </NewPostDialog>
      </div>
    </div>
  )
})

CreateSchedulerPopup.displayName = "CreateSchedulerPopup"

export default CreateSchedulerPopup
