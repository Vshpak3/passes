import "rc-time-picker/assets/index.css"
import "react-day-picker/dist/style.css"

import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import { addMinutes, addMonths, format } from "date-fns"
import { FC, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { toast } from "react-toastify"
import { TimePicker } from "src/components/atoms/TimePicker"
import { MAX_SCHEDULE_DURATION_IN_MONTHS } from "src/components/molecules/scheduler/CreateSchedulerPopup"
import { SCHEDULE_MINUTE_LIMIT } from "src/config/scheduler"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

export const CALENDAR_POPUP_ID = "calendar-popper"

export enum TimeShiftEnum {
  "AM",
  "PM"
}

export type Time = { minutes: number; hours: number; timeShift: TimeShiftEnum }

const dateToInternalTime = (date: Date) => {
  return {
    hours: (date.getHours() - 1) % 12,
    minutes: date.getMinutes(),
    timeShift: date.getHours() >= 12 ? TimeShiftEnum.PM : TimeShiftEnum.AM
  }
}

interface CalendarPickerProps {
  onSave: (date: Date | null) => void
  minuteLimit?: number
  maxDate?: Date
  scheduledTime?: Date | null
  children: React.ReactNode
}

export const CalendarPicker: FC<CalendarPickerProps> = ({
  onSave,
  minuteLimit = SCHEDULE_MINUTE_LIMIT,
  maxDate = addMonths(new Date(), MAX_SCHEDULE_DURATION_IN_MONTHS),
  scheduledTime,
  children
}) => {
  const today = new Date()

  const [month, setMonth] = useState<Date>(scheduledTime || today)
  const [selectionDate, setSelectionDate] = useState<Date | undefined>(
    scheduledTime || today
  )
  const { isMobile } = useWindowSize()
  const [time, setTime] = useState<Time>(
    scheduledTime
      ? dateToInternalTime(scheduledTime)
      : dateToInternalTime(today)
  )

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const calenderRef = useRef(null)

  const handleSelectToday = () => {
    const date = new Date()
    setSelectionDate(date)
    setMonth(date)
    setTime(dateToInternalTime(date))
  }

  const handleSaveDateAndTime = () => {
    const targetDate = selectionDate || new Date()

    targetDate.setHours(
      ((time.hours + 1) % 12) + (time.timeShift === TimeShiftEnum.PM ? 12 : 0),
      time.minutes,
      0,
      0
    )

    if (targetDate < addMinutes(new Date(), minuteLimit)) {
      toast.error(
        `An event must be scheduled at least ${minuteLimit} minutes from now`
      )
      return
    }

    onSave(targetDate)
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  useOnClickOutside(calenderRef, () => {
    setAnchorEl(null)
  })

  const open = Boolean(anchorEl)
  const id = open ? CALENDAR_POPUP_ID : undefined

  return (
    <>
      <div aria-describedby={id} onClick={handleClick}>
        {children}
      </div>
      <Popper
        id={id}
        open={open}
        placement={isMobile ? "bottom" : "right"}
        anchorEl={anchorEl}
        transition
        disablePortal={false}
        style={{ zIndex: 10000 }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              ref={calenderRef}
              className="rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-9 py-10 backdrop-blur-md"
            >
              <div className="calendar relative w-full">
                <div className="absolute top-11 flex w-full items-center gap-3 bg-[rgba(27,20,29,0.5)]">
                  <span className="z-10 flex-1 rounded-lg border border-white bg-[rgba(27,20,29,0.5)] py-[6px] px-[14px] text-base font-normal leading-6 text-white">
                    {selectionDate ? format(selectionDate, "MMM dd, yyyy") : ""}
                  </span>
                  <button
                    className="cursor-pointer select-none rounded-lg border-none bg-white py-[10px] px-[16px] text-passes-dark-700"
                    onClick={handleSelectToday}
                  >
                    Today
                  </button>
                </div>
                <DayPicker
                  mode="single"
                  showOutsideDays
                  required
                  selected={selectionDate}
                  onSelect={setSelectionDate}
                  month={month}
                  onMonthChange={setMonth}
                  fromDate={new Date()}
                  toDate={maxDate}
                />
                <div className="mt-3 flex w-full items-center justify-between">
                  <span className="text-base font-normal leading-6 text-white">
                    Time
                  </span>
                  <TimePicker time={time} setTime={setTime} />
                </div>
                <button
                  className="duration-400 mt-3 flex w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(27,20,29,0.5)] py-3 text-white transition-all hover:bg-white hover:text-passes-gray-200"
                  onClick={handleSaveDateAndTime}
                >
                  Save
                </button>
              </div>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  )
}
