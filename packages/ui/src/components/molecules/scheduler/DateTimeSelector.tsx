import classNames from "classnames"
import { addMonths, format, startOfMonth } from "date-fns"
import { FC, useContext } from "react"

import {
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_AGO,
  SCHEDULER_VIEWABLE_THIS_MANY_MONTHS_IN_FUTURE
} from "src/config/scheduler"
import { ChevronLeft } from "src/icons/ChevronLeft"
import { ChevronRight } from "src/icons/ChevronRight"
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
        aria-label="Go to previous month"
        disabled={disablePast}
        onClick={previousMonth}
        type="button"
      >
        <ChevronLeft
          className={classNames({ "opacity-[0.5]": disablePast })}
          height="24"
          width="24"
        />
      </button>
      <button onClick={showDateYearModal} type="button">
        <span className="w-[100px] select-none">
          {format(new Date(year, month, 1), "MMMM yyyy")}
        </span>
      </button>
      <button
        aria-label="Go to previous month"
        disabled={disableFuture}
        onClick={nextMonth}
        type="button"
      >
        <ChevronRight
          className={classNames({ "opacity-[0.5]": disableFuture })}
          height="24"
          width="24"
        />
      </button>
    </>
  )
}
