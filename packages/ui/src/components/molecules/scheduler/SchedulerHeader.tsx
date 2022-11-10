import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import PlusSquareIcon from "public/icons/plus-square.svg"
import { FC, useContext, useRef, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
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

  const handleToggleMonthYearPopper = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget)
    setMonthYearPopperOpen(!monthYearPopperOpen)
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
      {/* Month-Year Picker */}
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

      {/* Schedule new post */}
      <div className="relative flex items-center justify-center pb-6">
        <div className="flex items-center justify-between text-base font-bold md:w-[300px] md:text-2xl">
          <div className="flex items-center gap-1">
            <DateTimeSelected
              toggleMonthYearPopper={handleToggleMonthYearPopper}
            />
          </div>
        </div>
        <div className="absolute right-0">
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
            <Button>
              <PlusSquareIcon />
              <span className="hidden md:block">Schedule</span>
            </Button>
          </CalendarPicker>
        </div>
      </div>
    </>
  )
}
