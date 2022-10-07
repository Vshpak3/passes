import "react-day-picker/dist/style.css"
import "rc-time-picker/assets/index.css"

import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import { format } from "date-fns"
import { FC, useCallback, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import TimePicker from "src/components/atoms/TimePicker"
import { useOnClickOutside } from "src/hooks"

const css = `
  .rdp {
    margin: 0px;
  }
  .rdp-caption {
    position: relative!important;
  }
  .rdp-caption_label {
    width: 100%!important;
    text-align: center!important;
    display: block!important;
    font-weight: 500!important;
    font-size: 16px!important;
    line-height: 24px!important;
  }
  .rdp-nav {
    position: absolute!important;
    width: 100%!important;
    display: flex!important;
    justify-content: space-between!important;
    z-index: 100!important
  }
  .rdp-table {
    margin-top: 68px!important;
  }
  .rdp-day_selected:not([disabled]), .rdp-day_selected:focus:not([disabled]), .rdp-day_selected:active:not([disabled]), .rdp-day_selected:hover:not([disabled]) {
    background: #F9FAFB;
    border-radius: 20px;
    color: #0E0A0F;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    border: none;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 400ms;
    outline: none;
  }
  .rdp-button:hover:not([disabled]) {
    background: #F9FAFB;
    border-radius: 20px;
    color: #0E0A0F;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    border: none;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 400ms;
    outline: none;
  }
`

export type Time = { minutes: number; hours: number; hours24: number }

const today = new Date()
const defaultTime = { hours: 1, minutes: 0, hours24: 1 }

const CalendarPicker: FC<{
  children: React.ReactNode
  onSave: (date: Date | null) => void
}> = ({ children, onSave }) => {
  const [month, setMonth] = useState<Date>(today)
  const [selectionDate, setSelectionDate] = useState<Date | undefined>(today)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [time, setTime] = useState<Time>(defaultTime)

  const calenderRef = useRef(null)

  const handleSelectToday = useCallback(() => {
    const date = new Date(1665226217878)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    date.setHours(0, 0, 0, 0)
    setSelectionDate(date)
    setMonth(today)
    setTime({ hours: hours % 12 || 12, minutes, hours24: hours })
  }, [])

  const handleSaveDateAndTime = useCallback(() => {
    const targetDate = new Date(selectionDate || "")
    // add hour into current selectionDate
    targetDate.setHours(targetDate.getHours() + time.hours24)
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
              <style>{css}</style>
              <div className="relative w-full">
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

export default CalendarPicker
