import { PostDto } from "@passes/api-client"
import classNames from "classnames"
import { differenceInDays } from "date-fns"
import { flatten } from "lodash"
import { FC, useEffect, useState } from "react"
import { CalendarProps, useScheduledPosts } from "src/hooks/useScheduledPosts"

type CalendarDate = {
  date: Date
  inMonth: boolean
}

// Helper function to create the calendar matrix
function getCalendarMatrix(month: number, year: number) {
  const date = new Date(year, month, 1)
  const matrix: CalendarDate[][] = []

  // Go backwards to pad out the calendar
  if (date.getDay() % 7 !== 0) {
    matrix[0] = []
    const backwardDate = new Date(date)
    while (backwardDate.getDay() % 7 !== 0) {
      backwardDate.setDate(backwardDate.getDate() - 1)
      matrix[0].push({ date: new Date(backwardDate), inMonth: false })
    }
    matrix[0] = matrix[0].reverse()
  }

  // Go forward to fill up the month
  while (date.getMonth() === month) {
    if (date.getDay() % 7 === 0) {
      matrix.push([])
    }
    matrix[matrix.length - 1].push({ date: new Date(date), inMonth: true })
    date.setDate(date.getDate() + 1)
  }

  // Go forward to pad out the calendar
  while (matrix[matrix.length - 1].length !== 7) {
    matrix[matrix.length - 1].push({ date: new Date(date), inMonth: false })
    date.setDate(date.getDate() + 1)
  }

  return matrix
}

export const Calendar: FC<CalendarProps> = (monthYear) => {
  const [matrixDate, setMatrixDate] = useState<CalendarDate[]>([])

  const { data, setMonthYear } = useScheduledPosts()

  useEffect(() => {
    setMonthYear({ month: monthYear.month, year: monthYear.year })
    setMatrixDate(flatten(getCalendarMatrix(monthYear.month, monthYear.year)))
  }, [monthYear, setMonthYear])

  const countPostsInDate = (date: Date): number => {
    const postInThisDate = []
    data?.map((post: PostDto) => {
      if (post.scheduledAt && post.scheduledAt.getDate() === date.getDate()) {
        postInThisDate.push(post)
      }
    })
    return postInThisDate.length
  }

  return (
    <div className="mb-[52px] select-none px-[15px] md:px-[30px]">
      <div className="mb-[15px] flex items-center justify-evenly">
        <div className="w-[14.2%] pr-[12px] text-end">Sun</div>
        <div className="w-[14.2%] pr-[12px] text-end">Mon</div>
        <div className="w-[14.2%] pr-[12px] text-end">Tue</div>
        <div className="w-[14.2%] pr-[12px] text-end">Wed</div>
        <div className="w-[14.2%] pr-[12px] text-end">Thu</div>
        <div className="w-[14.2%] pr-[12px] text-end">Fri</div>
        <div className="w-[14.2%] pr-[12px] text-end">Sat</div>
      </div>
      <div className="flex flex-wrap">
        {matrixDate.map((date: CalendarDate, index) => {
          const numberPostInDate = countPostsInDate(date.date)
          return (
            <div
              key={index}
              className={classNames({
                "relative h-[80px] w-[14.2%] border border-[#ffffff26] p-[10px] text-end md:h-[160px]":
                  true,
                "text-passes-gray-200": !date.inMonth,
                "rounded-tl-[20px]": index === 0,
                "rounded-tr-[20px]": index === 6,
                "rounded-bl-[20px]": index === 35,
                "rounded-br-[20px]": index === 41
              })}
            >
              <span className="absolute top-3 right-3">
                {date.date.getDate()}
              </span>
              <div className="mt-7 flex w-full">
                {numberPostInDate > 0 && (
                  <span className="text-l w-full rounded bg-passes-primary-color px-2 py-[2px] text-left font-bold leading-6 text-white">
                    {numberPostInDate}
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
