import { compareAsc, format } from "date-fns"
import CalendarIcon from "public/icons/calendar-icon.svg"
import ClockIcon from "public/icons/clock-icon.svg"
import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { CalendarPicker } from "src/components/atoms/calendar/CalendarPicker"

export const MAX_SCHEDULE_DURATION_IN_MONTHS = 6

interface CreateSchedulerPopupProps {
  onCancel: () => void
  setIsNewPostModalOpen?: Dispatch<SetStateAction<boolean>>
  setSelectionDate?: Dispatch<SetStateAction<Date | null>>
  selectionDate?: Date | null
}

export const CreateSchedulerPopup = forwardRef<
  HTMLDivElement,
  CreateSchedulerPopupProps
>(
  (
    {
      onCancel,
      setIsNewPostModalOpen = () => null,
      setSelectionDate = () => null,
      selectionDate
    },
    ref
  ) => {
    const [selectedDateError, setSelectedDateError] = useState<string | null>(
      null
    )

    const setErrorHandler = (
      errorMsg = "please select a date to schedule a post."
    ) => {
      setSelectedDateError(errorMsg)
    }

    return (
      <div ref={ref} className="flex w-[100%] flex-col md:w-[450px]">
        <span className="mb-4 text-base font-medium leading-6 text-white">
          Create Schedule Post
        </span>
        <p className="mb-4 text-base font-normal leading-6 text-passes-secondary-color">
          Please choose a date and time for your action to be executed.
        </p>
        <CalendarPicker
          onSave={(date) => {
            if (!date && setSelectionDate) {
              setErrorHandler()
              setSelectionDate(null)
              return
            }

            if (!date) {
              return
            }

            if (compareAsc(new Date(), date) === 1) {
              setErrorHandler("Schedule date must be in future")
              return
            }

            setSelectionDate && setSelectionDate(date)
            setSelectedDateError(null)
          }}
        >
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

        {selectedDateError && (
          <span className="mt-2 block text-xs text-red-500">
            {selectedDateError}
          </span>
        )}

        <div className="mt-7 flex items-end justify-end">
          <button
            onClick={() => {
              onCancel()
              setIsNewPostModalOpen && setIsNewPostModalOpen(false)
            }}
            className="mr-[10px] rounded-[50px] bg-passes-dark-500 py-[10px] px-[21px] font-bold text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (!selectionDate) {
                setErrorHandler()
              }

              if (selectionDate) {
                onCancel()
                setIsNewPostModalOpen && setIsNewPostModalOpen(true)
              }
            }}
            className="rounded-[50px] bg-passes-primary-color py-[10px] px-[21px] font-bold text-white"
          >
            Create
          </button>
        </div>
      </div>
    )
  }
)

CreateSchedulerPopup.displayName = "CreateSchedulerPopup"
