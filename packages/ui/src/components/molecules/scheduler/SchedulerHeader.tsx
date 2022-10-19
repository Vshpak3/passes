import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import PlusQuareIcon from "public/icons/plus-square.svg"
import { FC, useContext, useRef, useState } from "react"
import { CalendarPicker } from "src/components/atoms/calendar/CalendarPicker"
import {
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO,
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
} from "src/config/scheduler"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { SchedulerContext } from "src/pages/tools/scheduler"

import { DateTimeSelected } from "./DateTimeSelector"
import { MonthYearPicker } from "./MonthYearPicker"
import { NewPostPopup } from "./NewPostPopup"

export const SchedulerHeader: FC = () => {
  const { month, year, setMonth, setYear } = useContext(SchedulerContext)

  const popperMonthYearPickerRef = useRef<HTMLDivElement | null>(null)

  const [monthYearPopperOpen, setMonthYearPopperOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [selectionDate, setSelectionDate] = useState<Date | null>(null)

  const handleShowMonthYearPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMonthYearPopperOpen(true)
  }

  const canBeMonthYearPopperOpen = monthYearPopperOpen && Boolean(anchorEl)
  const monthYearPopperId = canBeMonthYearPopperOpen
    ? "transition-popper"
    : undefined

  useOnClickOutside(popperMonthYearPickerRef, () => {
    setMonthYearPopperOpen(false)
  })

  return (
    <>
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
                maxPastMonths={SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO}
                maxFutureMonths={SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE}
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
        <CalendarPicker
          onSave={async (date: Date | null) => {
            if (!date) {
              return
            }
            setSelectionDate(date)
            setIsNewPostModalOpen(true)
          }}
        >
          <button className="flex h-[44px] w-[44px] appearance-none items-center gap-2 rounded-full bg-passes-primary-color py-[10px] pl-[10px] text-white md:w-[165px] md:px-[30px]">
            <PlusQuareIcon />
            <span className="hidden md:block">Schedule</span>
          </button>
        </CalendarPicker>
      </div>
      <div className="relative bottom-[35px] flex items-center justify-center md:hidden">
        <DateTimeSelected showDateYearModal={handleShowMonthYearPopper} />
      </div>
    </>
  )
}
