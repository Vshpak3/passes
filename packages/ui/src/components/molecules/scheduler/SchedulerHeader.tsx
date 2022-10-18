import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import PlusQuareIcon from "public/icons/plus-square.svg"
import { FC, useCallback, useContext, useRef, useState } from "react"
import { CALENDAR_POPUP_ID } from "src/components/atoms/calendar/CalendarPicker"
import { CreateSchedulerPopup } from "src/components/molecules/scheduler/CreateSchedulerPopup"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { SchedulerContext } from "src/pages/tools/scheduler"

import {
  DateTimeSelected,
  VIEWABLE_THIS_MANY_MONTHS_AGO,
  VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
} from "./DateTimeSelector"
import { MonthYearPicker } from "./MonthYearPicker"
import { NewPostPopup } from "./NewPostPopup"

export const SchedulerHeader: FC = () => {
  const { month, year, setMonth, setYear } = useContext(SchedulerContext)

  const popperContainerRef = useRef<HTMLDivElement | null>(null)
  const popperMonthYearPickerRef = useRef<HTMLDivElement | null>(null)

  const [monthYearPopperOpen, setMonthYearPopperOpen] = useState(false)
  const [createScheduleOpen, setCreateScheduleOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [buttonCreateSchedulerEl, setButtonCreateSchedulerEl] =
    useState<null | HTMLElement>(null)

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [selectionDate, setSelectionDate] = useState<Date | null>(null)

  const handleShowMonthYearPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMonthYearPopperOpen(true)
  }

  const handleShowCreateSchedulerPopper = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setButtonCreateSchedulerEl(event.currentTarget)
    setCreateScheduleOpen(true)
  }

  const canBeMonthYearPopperOpen = monthYearPopperOpen && Boolean(anchorEl)
  const monthYearPopperId = canBeMonthYearPopperOpen
    ? "transition-popper"
    : undefined

  const canBeCreateSchedulerPopperOpen =
    monthYearPopperOpen && Boolean(anchorEl)
  const createSchedulerPopperId = canBeCreateSchedulerPopperOpen
    ? "transition-popper"
    : undefined

  const dismissCreateSchedulerPopper = useCallback(() => {
    buttonCreateSchedulerEl && setButtonCreateSchedulerEl(null)
    setCreateScheduleOpen(false)
  }, [buttonCreateSchedulerEl])

  useOnClickOutside(popperMonthYearPickerRef, () => {
    setMonthYearPopperOpen(false)
  })

  useOnClickOutside(popperContainerRef, (e) => {
    const calendarPopup = document.getElementById(CALENDAR_POPUP_ID)

    if (e.target instanceof Node && calendarPopup?.contains(e.target)) {
      return
    }

    dismissCreateSchedulerPopper()
  })

  return (
    <>
      {/* create new schedule popup */}
      <Popper
        id={createSchedulerPopperId}
        open={createScheduleOpen}
        anchorEl={buttonCreateSchedulerEl}
        transition
        placement="bottom-end"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 17]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              ref={popperContainerRef}
              className="mr-[25px] w-[320px] rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md md:mr-0 md:w-[480px]"
            >
              {createScheduleOpen && (
                <CreateSchedulerPopup
                  onCancel={dismissCreateSchedulerPopper}
                  setIsNewPostModalOpen={setIsNewPostModalOpen}
                  setSelectionDate={setSelectionDate}
                  selectionDate={selectionDate}
                />
              )}
            </div>
          </Fade>
        )}
      </Popper>

      {/* month year picker */}
      <Popper
        id={monthYearPopperId}
        open={monthYearPopperOpen}
        anchorEl={anchorEl}
        transition
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              ref={popperMonthYearPickerRef}
              className="month-year-picker-wrapper rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md"
            >
              <MonthYearPicker
                maxPastMonths={VIEWABLE_THIS_MANY_MONTHS_AGO}
                maxFutureMonths={VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE}
                selectedMonth={month}
                selectedYear={year}
                onChangeYear={setYear}
                onChangeMonth={setMonth}
              />
            </div>
          </Fade>
        )}
      </Popper>

      {/* Create new post */}
      <NewPostPopup
        isOpen={isNewPostModalOpen && !!selectionDate}
        onCancel={() => setIsNewPostModalOpen(false)}
        selectionDate={selectionDate as Date}
      />

      <div className="flex items-center justify-between py-[45px] px-[15px] md:px-[30px]">
        <div className="select-none text-base font-bold md:text-2xl">
          Scheduler
        </div>
        <div className="flex items-center justify-between text-base font-bold md:w-[300px] md:text-2xl">
          <div className="flex items-center gap-1">
            <div className="hidden md:flex">
              <DateTimeSelected showDateYearModal={handleShowMonthYearPopper} />
            </div>
          </div>
        </div>
        <button
          className="flex h-[44px] w-[44px] appearance-none items-center gap-2 rounded-full bg-passes-primary-color py-[10px] pl-[10px] text-white md:w-[165px] md:px-[30px]"
          onClick={handleShowCreateSchedulerPopper}
        >
          <PlusQuareIcon />
          <span className="hidden md:block">Schedule</span>
        </button>
      </div>
      <div className="relative bottom-[35px] flex items-center justify-center md:hidden">
        <DateTimeSelected showDateYearModal={handleShowMonthYearPopper} />
      </div>
    </>
  )
}
