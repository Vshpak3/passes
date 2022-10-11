import "react-day-picker/dist/style.css"
import "rc-time-picker/assets/index.css"

import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import { format } from "date-fns"
import { FC, useCallback, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { TimePicker } from "src/components/atoms/TimePicker"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const hoursTo24Hours = (hours: number, timeShift: TimeShiftEnum) => {
  if (timeShift === TimeShiftEnum.PM) {
    return 12 + (hours === 12 ? 0 : hours)
  }

  return hours
}

export enum TimeShiftEnum {
  "AM",
  "PM"
}
export type Time = { minutes: number; hours: number; timeShift: TimeShiftEnum }

const today = new Date()
const defaultTime = {
  hours: new Date().getHours() % 12 || 12,
  minutes: new Date().getMinutes(),
  timeShift: new Date().getHours() >= 12 ? TimeShiftEnum.PM : TimeShiftEnum.AM
}

export const CalendarPicker: FC<{
  children: React.ReactNode
  onSave: (date: Date | null) => void
  toDate?: Date
}> = ({ children, onSave, toDate }) => {
  const [month, setMonth] = useState<Date>(today)
  const [selectionDate, setSelectionDate] = useState<Date | undefined>(today)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [time, setTime] = useState<Time>(defaultTime)

  const calenderRef = useRef(null)

  const handleSelectToday = useCallback(() => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    date.setHours(0, 0, 0, 0)
    setSelectionDate(date)
    setMonth(today)
    setTime({
      hours: hours % 12 || 12,
      minutes,
      timeShift: hours >= 12 ? TimeShiftEnum.PM : TimeShiftEnum.AM
    })
  }, [])

  const handleSaveDateAndTime = useCallback(() => {
    const targetDate = new Date(selectionDate || "")
    // add hour into current selectionDate
    targetDate.setHours(
      targetDate.getHours() + hoursTo24Hours(time.hours, time.timeShift)
    )
    // add min into current selectionDate
    targetDate.setMinutes(targetDate.getMinutes() + time.minutes)
    onSave(targetDate)
    setAnchorEl(null)
  }, [onSave, selectionDate, time])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  useOnClickOutside(calenderRef, () => {
    setAnchorEl(null)
  })

  const open = Boolean(anchorEl)
  const id = open ? "simple-popper" : undefined

  return (
    <>
      <div aria-describedby={id} onClick={handleClick}>
        {children}
      </div>
      <Popper
        id={id}
        open={open}
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
                  onMonthChange={setMonth}
                  fromDate={new Date()}
                  toDate={toDate}
                  month={month}
                />
                <div className="mt-3 flex w-full items-center justify-between">
                  <span className="text-base font-normal leading-6 text-white">
                    TIME
                  </span>
                  <TimePicker
                    defualtTime={defaultTime}
                    time={time}
                    setTime={setTime}
                  />
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
