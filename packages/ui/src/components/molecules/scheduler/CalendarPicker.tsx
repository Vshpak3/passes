import "react-day-picker/dist/style.css"
import "rc-time-picker/assets/index.css"

import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import classNames from "classnames"
import { format, isSameMonth } from "date-fns"
import moment, { Moment } from "moment"
import TimePicker from "rc-time-picker"
import { FC, useCallback, useState } from "react"
import { DayPicker } from "react-day-picker"

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
  .rc-time-picker {
    background: #0E0A0F;
    border-radius: 8px;
    outline: none;
  }
  .rc-time-picker-input {
    border-radius: 8px;
    outline: none;
    background: none;
    padding: 18.5px 19px;
    color: white;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    outline: none;
  }
  .rc-time-picker-panel-inner {
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
  }
  .rc-time-picker-panel-select li:hover {
    background: #edfaff42;
    border: #6a6868;
  }
  .rc-time-picker-panel-input-wrap, .rc-time-picker-panel-select, rc-time-picker-panel-select-option-selected {
    background: #0E0A0F;
    outline: none;
    color: white;
    border: #6a6868;
  }
  li.rc-time-picker-panel-select-option-selected {
    background: #030203;
    outline: none;
    color: white;
  }
`
const today = new Date()

const CalendarPicker: FC<{
  children: React.ReactNode
  onSave: (date: Date | null) => void
}> = ({ children, onSave }) => {
  const [month, setMonth] = useState<Date>(today)
  const [selectionDate, setSelectionDate] = useState<Date | undefined>(today)
  const [selectionPartTime, setSelectionPartTime] = useState<string>("AM")
  const [selectionTime, setSelectionTime] = useState<Moment>(moment())
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleSelectToday = useCallback(() => {
    setSelectionDate(new Date())
    setMonth(today)
  }, [])

  const handleChangeTime = useCallback((value: Moment) => {
    setSelectionTime(value)
    const timePart = value.format("A")
    setSelectionPartTime(timePart)
  }, [])

  const handleSaveDateAndTime = useCallback(() => {
    const targetDate = new Date(selectionDate || "")
    // add hour into current selectionDate
    targetDate.setHours(
      targetDate.getHours() + parseInt(selectionTime.format("hh"))
    )
    // add min into current selectionDate
    targetDate.setMinutes(
      targetDate.getMinutes() + parseInt(selectionTime.format("mm"))
    )
    onSave(targetDate)
    setAnchorEl(null)
  }, [onSave, selectionDate, selectionTime])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

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
            <div className="rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-9 py-10 backdrop-blur-md">
              <style>{css}</style>
              <div className="relative w-full">
                <div className="absolute top-11 flex w-full items-center gap-3 bg-[rgba(27,20,29,0.5)]">
                  <span className="z-10 flex-1 rounded-lg border border-white bg-[rgba(27,20,29,0.5)] py-[6px] px-[14px] text-base font-normal leading-6 text-white">
                    {selectionDate ? format(selectionDate, "MMM dd, yyyy") : ""}
                  </span>
                  <button
                    className="cursor-pointer select-none rounded-lg border-none bg-white py-[10px] px-[16px] text-passes-gray-200"
                    disabled={isSameMonth(today, month)}
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
                  <div className="flex items-center gap-2">
                    <div className="w-[98px]">
                      <TimePicker
                        clearIcon={null}
                        showSecond={false}
                        allowEmpty={false}
                        hideDisabledOptions
                        format="hh:mm"
                        defaultValue={moment()}
                        onChange={handleChangeTime}
                      />
                    </div>
                    <span className="flex rounded-lg border border-white">
                      <span
                        className={classNames({
                          "duration-400 flex-1 cursor-pointer rounded-bl-lg rounded-tl-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200":
                            true,
                          "bg-white text-passes-gray-200":
                            selectionPartTime === "AM"
                        })}
                      >
                        AM
                      </span>
                      <span
                        className={classNames({
                          "duration-400 flex-1 cursor-pointer rounded-tr-lg rounded-br-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200":
                            true,
                          "bg-white text-passes-gray-200":
                            selectionPartTime === "PM"
                        })}
                      >
                        PM
                      </span>
                    </span>
                  </div>
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
