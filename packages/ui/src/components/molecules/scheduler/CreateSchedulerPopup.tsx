// import classNames from "classnames"
import moment, { Moment } from "moment"
import CalendarIcon from "public/icons/calendar-icon.svg"
import ClockIcon from "public/icons/clock-icon.svg"
// TODO: temporary comment out, please ignore
// import FileIcon from "public/icons/file-icon.svg"
// import MessageTextIcon from "public/icons/message-text-icon.svg"
import { forwardRef, useCallback, useContext, useState } from "react"
import CalendarPicker from "src/components/molecules/scheduler/CalendarPicker"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/pages/profile/main-content/new-post"
import { MainContext } from "src/context/MainContext"
import { CreatePostValues, useCreatePost } from "src/hooks"
interface CreateSchedulerPopupProps {
  onCancel: () => void
}

const CreateSchedulerPopup = forwardRef<
  HTMLDivElement,
  CreateSchedulerPopupProps
>((props, ref) => {
  const { onCancel } = props
  const [selectionDate, setSelectionDate] = useState<Date | undefined>()
  const [selectionTime, setSelectionTime] = useState<Moment>()
  const { setPostTime } = useContext(MainContext)
  // TODO: temporary comment out, please ignore
  // const [creatingOption, setCreatingOption] = useState("post")
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const { createPost } = useCreatePost()

  const handleSaveTime = useCallback(
    (date: Date | undefined, time: Moment) => {
      setSelectionDate(date)
      setSelectionTime(time)
      // set the post Time to global context like the way components/atoms/DateAndTimePicker.tsx:71 and /hooks/useCreatePost.ts:20 did
      const selectionDate = new Date(date || "")
      // add hour into current selectionDate
      selectionDate.setHours(
        selectionDate.getHours() + parseInt(time.format("hh"))
      )
      // add min into current selectionDate
      selectionDate.setMinutes(
        selectionDate.getMinutes() + parseInt(time.format("mm"))
      )
      setPostTime({ $d: selectionDate })
    },
    [setPostTime]
  )

  // TODO: temporary comment out, please ignore
  // const handleChangeCreatingOption = useCallback((value: string) => {
  //   setCreatingOption(value)
  // }, [])

  const handleCreatePost = (values: CreatePostValues) => {
    createPost(values)
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
              {selectionDate ? moment(selectionDate).format("MM/DD/YYYY") : ""}
            </span>
            <span className="absolute right-[10px]">
              <CalendarIcon />
            </span>
          </div>
          <div className="relative flex h-[45px] flex-1 items-center rounded-md border border-passes-dark-200 bg-passes-dark-700 p-2 text-white">
            <span>{`${
              selectionTime ? selectionTime.format("hh:mm A") : ""
            }`}</span>
            <span className="absolute right-[10px]">
              <ClockIcon />
            </span>
          </div>
        </div>
      </CalendarPicker>
      {/* TODO: temporary comment out, please ignore */}
      {/* <span className="my-4 text-base font-medium leading-6 text-white">
        Choose
      </span>
      <div className="flex flex-col gap-3">
        <div
          onClick={() => handleChangeCreatingOption("post")}
          className={classNames({
            "duration-400 flex h-[45px] w-full flex-1 cursor-pointer items-center gap-3 rounded-md border border-passes-dark-200 bg-passes-dark-700 p-2 font-bold text-white transition-all hover:bg-passes-primary-color":
              true,
            "bg-passes-primary-color": creatingOption === "post"
          })}
        >
          <FileIcon />
          <span>Post</span>
        </div>
         <div
          onClick={() => handleChangeCreatingOption("mass")}
          className={classNames({
            "duration-400 flex h-[45px] w-full flex-1 cursor-pointer items-center gap-3 rounded-md border border-passes-dark-200 bg-passes-dark-700 p-2 font-bold text-white transition-all hover:bg-passes-primary-color":
              true,
            "bg-passes-primary-color": creatingOption === "mass"
          })}
        >
          <MessageTextIcon />
          <span>Mass Message</span>
        </div>
      </div> */}
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
