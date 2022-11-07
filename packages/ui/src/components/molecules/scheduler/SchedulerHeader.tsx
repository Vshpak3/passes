import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import PlusSquareIcon from "public/icons/plus-square.svg"
import { FC, useContext, useRef, useState } from "react"

import { CalendarPicker } from "src/components/atoms/calendar/CalendarPicker"
import {
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO,
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
} from "src/config/scheduler"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { SchedulerContext } from "src/pages/tools/scheduler"
import { DateTimeSelected } from "./DateTimeSelector"
import { MonthYearPicker } from "./MonthYearPicker"
import { NewPostPopup } from "./NewPostPopup"

export const SchedulerHeader: FC = () => {
  const { month, year, setMonth, setYear } = useContext(SchedulerContext)
  const { isMobile } = useWindowSize()

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

  if (isMobile === undefined) {
    return null
  }

  return (
    <>
      {/* month year picker */}
      <Popper
        anchorEl={anchorEl}
        id={monthYearPopperId}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          }
        ]}
        open={monthYearPopperOpen}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              className="rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md"
              ref={popperMonthYearPickerRef}
            >
              <MonthYearPicker
                maxFutureMonths={SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE}
                maxPastMonths={SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO}
                onChangeMonth={setMonth}
                onChangeYear={setYear}
                selectedMonth={month}
                selectedYear={year}
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

      <div className="flex items-center justify-between px-[15px] pb-[45px] md:px-[30px]">
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
          placement={isMobile ? "bottom" : "auto"}
        >
          <button className="flex h-[44px] w-[44px] appearance-none items-center gap-2 rounded-full bg-passes-primary-color py-[10px] pl-[10px] text-white md:w-[165px] md:px-[30px]">
            <PlusSquareIcon />
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
