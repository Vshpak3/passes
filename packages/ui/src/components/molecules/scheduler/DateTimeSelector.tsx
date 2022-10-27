import classNames from "classnames"
import { addMonths, format, startOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FC, useContext } from "react"

import {
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO,
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
} from "src/config/scheduler"
import { SchedulerContext } from "src/pages/tools/scheduler"

interface DateTimeSelectedProps {
  showDateYearModal: (event: React.MouseEvent<HTMLElement>) => void
}

export const DateTimeSelected: FC<DateTimeSelectedProps> = ({
  showDateYearModal
}) => {
  const { month, year, setMonth, setYear } = useContext(SchedulerContext)

  const previousMonth = () => {
    setMonth(month === 0 ? 11 : month - 1)
    setYear(month === 0 ? year - 1 : year)
  }

  const nextMonth = () => {
    setMonth(month === 11 ? 0 : month + 1)
    setYear(month === 11 ? year + 1 : year)
  }

  const disablePast =
    addMonths(
      startOfMonth(new Date()),
      -1 * SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO
    ) >= new Date(year, month, 1)

  const disableFuture =
    addMonths(
      startOfMonth(new Date()),
      SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
    ) <= new Date(year, month, 1)

  return (
    <>
      <button
        type="button"
        aria-label="Go to previous month"
        disabled={disablePast}
        onClick={previousMonth}
      >
        <ChevronLeft
          size={32}
          className={classNames({ "opacity-[0.5]": disablePast })}
        />
      </button>
      <button type="button" onClick={showDateYearModal}>
        <span className="w-[100px] select-none">
          {format(new Date(year, month, 1), "MMMM yyyy")}
        </span>
      </button>
      <button
        type="button"
        aria-label="Go to previous month"
        disabled={disableFuture}
        onClick={nextMonth}
      >
        <ChevronRight
          size={32}
          className={classNames({ "opacity-[0.5]": disableFuture })}
        />
      </button>
    </>
  )
}
