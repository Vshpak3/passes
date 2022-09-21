import classNames from "classnames"
import moment, { Moment } from "moment"
import CalendarIcon from "public/icons/calendar-icon.svg"
import ClockIcon from "public/icons/clock-icon.svg"
import FileIcon from "public/icons/file-icon.svg"
import MessageTextIcon from "public/icons/message-text-icon.svg"
import { forwardRef, useCallback, useState } from "react"
import CalendarPicker from "src/components/atoms/CalendarPicker"

interface CreateSchedulerPopupProps {
  onCancel: () => void
}

export const CreateSchedulerPopup = forwardRef<
  HTMLDivElement,
  CreateSchedulerPopupProps
>((props, ref) => {
  const { onCancel } = props
  const [selectionDate, setSelectionDate] = useState<Date | undefined>()
  const [selectionTime, setSelectionTime] = useState<Moment>()
  const [creatingOption, setCreatingOption] = useState("post")

  const handleSaveTime = useCallback((date: Date | undefined, time: Moment) => {
    setSelectionDate(date)
    setSelectionTime(time)
  }, [])

  const handleChangeCreatingOption = useCallback((value: string) => {
    setCreatingOption(value)
  }, [])

  return (
    <div ref={ref} className="flex w-[450px] flex-col">
      <span className="mb-4 text-base font-medium leading-6 text-white">
        Create Schedule
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
      <span className="my-4 text-base font-medium leading-6 text-white">
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
      </div>
      <div className="mt-7 flex items-center justify-end">
        <button
          onClick={onCancel}
          className="mr-[10px] rounded-[50px] bg-passes-dark-500 py-[10px] px-[21px] font-bold text-white"
        >
          Cancel
        </button>
        <button className="rounded-[50px] bg-passes-primary-color py-[10px] px-[21px] font-bold text-white">
          Create
        </button>
      </div>
    </div>
  )
})

CreateSchedulerPopup.displayName = "CreateSchedulerPopup"
