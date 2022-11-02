import { ScheduledEventDto } from "@passes/api-client"
import classNames from "classnames"
import { enUS } from "date-fns/locale"
import { flatten } from "lodash"
import { FC, Fragment, useContext, useEffect, useState } from "react"

import { useScheduledEvents } from "src/hooks/useScheduledEvents"
import { SchedulerContext } from "src/pages/tools/scheduler"

const DAYS_IN_WEEK = 7

type CalendarDate = {
  date: Date
  inMonth: boolean
}

// Helper function to create the calendar matrix
function getCalendarMatrix(month: number, year: number) {
  const date = new Date(year, month, 1)
  const matrix: CalendarDate[][] = []

  // Go backwards to pad out the calendar
  if (date.getDay() % DAYS_IN_WEEK !== 0) {
    matrix[0] = []
    const backwardDate = new Date(date)
    while (backwardDate.getDay() % DAYS_IN_WEEK !== 0) {
      backwardDate.setDate(backwardDate.getDate() - 1)
      matrix[0].push({ date: new Date(backwardDate), inMonth: false })
    }
    matrix[0] = matrix[0].reverse()
  }

  // Go forward to fill up the month
  while (date.getMonth() === month) {
    if (date.getDay() % DAYS_IN_WEEK === 0) {
      matrix.push([])
    }
    matrix[matrix.length - 1].push({ date: new Date(date), inMonth: true })
    date.setDate(date.getDate() + 1)
  }

  // Go forward to pad out the calendar
  while (matrix[matrix.length - 1].length !== DAYS_IN_WEEK) {
    matrix[matrix.length - 1].push({ date: new Date(date), inMonth: false })
    date.setDate(date.getDate() + 1)
  }

  return matrix
}

export const Calendar: FC = () => {
  const { month, year } = useContext(SchedulerContext)

  const [matrixDate, setMatrixDate] = useState<CalendarDate[]>([])

  const { data, setMonthYear } = useScheduledEvents()

  useEffect(() => {
    setMonthYear({ month, year })
    setMatrixDate(flatten(getCalendarMatrix(month, year)))
  }, [month, year, setMonthYear])

  const countEventsInDate = (date: Date): [number, number] => {
    const onDate = data?.filter(
      (event: ScheduledEventDto) =>
        event.scheduledAt &&
        event.scheduledAt.getMonth() === date.getMonth() &&
        event.scheduledAt.getDate() === date.getDate()
    )
    return [
      onDate?.filter((e) => e.processed).length || 0,
      onDate?.filter((e) => !e.processed).length || 0
    ]
  }

  return (
    <div className="mb-[52px] select-none px-[15px] md:px-[30px]">
      <div className="mb-[15px] flex items-center justify-evenly">
        {Array(DAYS_IN_WEEK)
          .fill(0)
          .map((_, i) => (
            <Fragment key={i}>
              <div className="hidden w-[14.2%] pr-[12px] text-end md:grid">
                {enUS.localize?.day(i)}
              </div>
              <div className="w-[14.2%] pr-[12px] text-end md:hidden">
                {enUS.localize?.day(i, { width: "abbreviated" })}
              </div>
            </Fragment>
          ))}
      </div>
      <div className="flex flex-wrap">
        {matrixDate.map((date: CalendarDate, index) => {
          const [numberProcessedPostInDate, numberPendingPostInDate] =
            countEventsInDate(date.date)
          return (
            <div
              className={classNames({
                "relative h-[80px] w-[14.2%] border border-[#ffffff26] p-[10px] text-end md:h-[160px]":
                  true,
                "text-passes-gray-300": !date.inMonth,
                "rounded-tl-[10px]": index === 0,
                "rounded-tr-[10px]": index === 6,
                "rounded-bl-[10px]": index === 35,
                "rounded-br-[10px]": index === 41
              })}
              key={date.date.toDateString()}
            >
              <span className="absolute top-3 right-3">
                {date.date.getDate()}
              </span>
              <div className="mt-7 flex w-full">
                {numberProcessedPostInDate > 0 && (
                  <span className="text-l w-full rounded bg-gray-400 px-2 py-[2px] text-left font-bold leading-6 text-white opacity-[0.40]">
                    {numberProcessedPostInDate}
                  </span>
                )}
                {numberPendingPostInDate > 0 && (
                  <span className="text-l w-full rounded bg-passes-primary-color px-2 py-[2px] text-left font-bold leading-6 text-white">
                    {numberPendingPostInDate}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
