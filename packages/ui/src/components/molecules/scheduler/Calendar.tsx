import CalendarDates from "calendar-dates"
import classNames from "classnames"
import { format } from "date-fns"
import { flatten } from "lodash"
import { FC, useEffect, useState } from "react"
import { useScheduledPosts } from "src/hooks/useScheduledPosts"

type CalendarProps = {
  month: number
  year: number
}

const calendarDates = new CalendarDates()

export const Calendar: FC<CalendarProps> = ({ month, year }) => {
  const [matrixDate, setMatrixDate] = useState([])
  const { data } = useScheduledPosts()

  useEffect(() => {
    ;(async function () {
      const selectionTime = new Date(year, month)
      const matrix = await calendarDates.getMatrix(selectionTime)
      setMatrixDate(flatten(matrix))
    })()
  }, [month, year])

  const countPostsInDate = (date: string): any => {
    let postInThisDate: Array<any> = []
    data?.map((post: any) => {
      if (format(new Date(post.scheduledAt), "yyyy-MM-dd") === date) {
        postInThisDate = [...postInThisDate, post]
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
        {matrixDate.map((currentDate: Record<string, string>, index) => {
          const { date, iso, type } = currentDate
          const numberPostInDate = countPostsInDate(iso)
          return (
            <div
              key={iso}
              className={classNames({
                "relative h-[80px] w-[14.2%] border border-[#ffffff26] p-[10px] text-end md:h-[160px]":
                  true,
                "text-passes-gray-200": type === "previous" || type === "next",
                "rounded-tl-[20px]": index === 0,
                "rounded-tr-[20px]": index === 6,
                "rounded-bl-[20px]": index === 35,
                "rounded-br-[20px]": index === 41
              })}
            >
              <span className="absolute top-3 right-3">{date}</span>
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
