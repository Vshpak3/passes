import CalendarDates from "calendar-dates"
import classNames from "classnames"
import { flatten } from "lodash"
import { FC, useEffect, useState } from "react"

type CalendarProps = {
  month: number
  year: number
}

const calendarDates = new CalendarDates()

const Calendar: FC<CalendarProps> = ({ month, year }) => {
  const [matrixDate, setMatrixDate] = useState([])

  useEffect(() => {
    ;(async function () {
      const selectionTime = new Date(year, month)
      const matrix = await calendarDates.getMatrix(selectionTime)
      console.log(flatten(matrix))
      setMatrixDate(flatten(matrix))
    })()
  }, [month, year])

  return (
    <div className="select-none px-[15px] md:px-[30px]">
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
          return (
            <div
              key={iso}
              className={classNames({
                "h-[80px] w-[14.2%] border border-[#ffffff26] p-[10px] text-end md:h-[160px]":
                  true,
                "text-passes-gray-200": type === "previous" || type === "next",
                "rounded-tl-[20px]": index === 0,
                "rounded-tr-[20px]": index === 6,
                "rounded-bl-[20px]": index === 35,
                "rounded-br-[20px]": index === 41
              })}
            >
              {date}
            </div>
          )
        })}
      </div>
      {/* <div className="flex flex-wrap">
        {[...Array(42)].map((item, index) =>
          index >= months[activeDateIndex]?.firstDayIndex ? (
            <div
              key={index}
              className={`h-[80px] w-[14.2%] border border-[#ffffff26] p-[10px] text-end md:h-[160px] ${
                index === 0
                  ? "rounded-tl-[20px]"
                  : index === 6
                  ? "rounded-tr-[20px]"
                  : index === 35
                  ? "rounded-bl-[20px]"
                  : index === 41
                  ? "rounded-br-[20px]"
                  : null
              } `}
            >
              {index - months[activeDateIndex]?.firstDayIndex + 1 <=
              months[activeDateIndex]?.days
                ? index - months[activeDateIndex]?.firstDayIndex + 1
                : null}
            </div>
          ) : (
            <div
              key={index}
              className={`h-[80px] w-[14.2%] border border-[#ffffff26] md:h-[160px] ${
                index === 0
                  ? "rounded-tl-[20px]"
                  : index === 6
                  ? "rounded-tr-[20px]"
                  : index === 35
                  ? "rounded-bl-[20px]"
                  : index === 41
                  ? "rounded-br-[20px]"
                  : null
              }`}
            ></div>
          )
        )}
      </div> */}
    </div>
  )
}

export default Calendar
