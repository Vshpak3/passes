import "rc-time-picker/assets/index.css"
import "react-day-picker/dist/style.css"
import Fade from "@mui/material/Fade"
import Popper, { PopperPlacementType } from "@mui/material/Popper"
import { addMinutes, addMonths, format } from "date-fns"
import { FC, useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { toast } from "react-toastify"

import { TimePicker } from "src/components/atoms/TimePicker"
import {
  MAX_SCHEDULE_DURATION_IN_MONTHS,
  SCHEDULE_MINUTE_LIMIT
} from "src/config/scheduler"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const CALENDAR_POPUP_ID = "calendar-popper"

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

export interface CalendarPickerProps {
  onSave: (date: Date | null) => void
  minuteLimit?: number
  maxDate?: Date
  scheduledTime?: Date | null
  children: React.ReactNode
  placement: PopperPlacementType
  setOpen?: (open: boolean) => void
}

export const CalendarPicker: FC<CalendarPickerProps> = ({
  onSave,
  minuteLimit = SCHEDULE_MINUTE_LIMIT,
  maxDate = addMonths(new Date(), MAX_SCHEDULE_DURATION_IN_MONTHS),
  scheduledTime,
  children,
  placement,
  setOpen
}) => {
  const today = new Date()

  const [month, setMonth] = useState<Date>(scheduledTime || today)
  const [selectionDate, setSelectionDate] = useState<Date | undefined>(
    scheduledTime || today
  )
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

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  useOnClickOutside(calenderRef, () => {
    setAnchorEl(null)
  })

  useEffect(() => {
    if (setOpen) {
      setOpen(!anchorEl)
    }
  }, [anchorEl, setOpen])

  const open = Boolean(anchorEl)
  const id = open ? CALENDAR_POPUP_ID : undefined

  return (
    <>
      <div
        aria-describedby={id}
        onClick={handleClick}
        onMouseDown={stopPropagation}
      >
        {children}
      </div>
      <Popper
        anchorEl={anchorEl}
        disablePortal={false}
        id={id}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            }
          }
        ]}
        open={open}
        placement={placement}
        style={{
          zIndex: 10000,
          margin: "0px"
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              className="h-[567px] rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-9 py-10 backdrop-blur-md"
              ref={calenderRef}
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
                  fromDate={new Date()}
                  mode="single"
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={setSelectionDate}
                  required
                  selected={selectionDate}
                  showOutsideDays
                  toDate={maxDate}
                />
                <div className="mt-3 flex w-full items-center justify-between">
                  <span className="text-base font-normal leading-6 text-white">
                    Time
                  </span>
                  <TimePicker setTime={setTime} time={time} />
                </div>
                <button
                  className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[rgba(27,20,29,0.5)] py-3 text-white transition-all hover:bg-white hover:text-passes-gray-200"
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
