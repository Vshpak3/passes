import classNames from "classnames"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { FC, useMemo, useState } from "react"

interface MonthYearPickerProps {
  selectedYear: number
  selectedMonth: number
  maxPastMonths?: number
  maxFutureMonths?: number
  onChangeYear: any
  onChangeMonth: any
}

const today = new Date()

export const MonthYearPicker: FC<MonthYearPickerProps> = ({
  selectedYear,
  selectedMonth,
  onChangeYear,
  maxPastMonths,
  maxFutureMonths,
  onChangeMonth
}) => {
  const [currentYear, setCurrentYear] = useState(selectedYear)

  const minMonth = useMemo(() => {
    return maxPastMonths ? today.getMonth() - (maxPastMonths % 12) : undefined
  }, [maxPastMonths])

  const maxMonth = useMemo(() => {
    return maxFutureMonths
      ? (today.getMonth() + (maxFutureMonths % 12)) % 12
      : undefined
  }, [maxFutureMonths])

  const minYear = useMemo(() => {
    return maxPastMonths
      ? today.getFullYear() -
          Math.trunc(maxPastMonths / 12) +
          (today.getMonth() + 1 - (maxPastMonths % 12) > 0 ? 0 : 1)
      : undefined
  }, [maxPastMonths])

  const maxYear = useMemo(() => {
    return maxFutureMonths
      ? today.getFullYear() +
          Math.trunc(maxFutureMonths / 12) +
          ((maxFutureMonths % 12) + today.getMonth() > 11 ? 1 : 0)
      : undefined
  }, [maxFutureMonths])

  const isDisabledBtn = (currentMonth: number) => {
    return (
      (!!maxMonth && currentYear === maxYear && currentMonth > maxMonth) ||
      (!!minMonth && currentYear === minYear && currentMonth < minMonth)
    )
  }

  const handleOnClickLeftArrow = () => {
    if (!minYear || currentYear > minYear) {
      setCurrentYear((prevYear) => prevYear - 1)
    }
  }

  const handleOnClickRightArrow = () => {
    if (!maxYear || currentYear <= maxYear) {
      setCurrentYear((prevYear) => prevYear + 1)
    }
  }

  return (
    <div className="w-[400px]">
      <div className="relative mb-5">
        <span className="block text-center text-[25px] font-bold text-passes-primary-color">
          {currentYear}
        </span>
        <div className="absolute right-0 -top-1">
          <button
            disabled={currentYear === minYear}
            onClick={handleOnClickLeftArrow}
          >
            <ChevronLeft
              size={32}
              className={classNames({
                "opacity-[0.3]": currentYear === minYear
              })}
            />
          </button>
          <button
            disabled={currentYear === maxYear}
            onClick={handleOnClickRightArrow}
          >
            <ChevronRight
              size={32}
              className={classNames({
                "opacity-[0.3]": currentYear === maxYear
              })}
            />
          </button>
        </div>
      </div>
      <div className="m-2.5 grid grid-cols-4 gap-5">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <button
              key={i}
              className={classNames(
                "flex h-[55px] items-center justify-center rounded-lg bg-passes-dark-200 font-bold text-white transition-all duration-100",
                isDisabledBtn(i) ? "text-gray-600" : "hover:bg-[#4f4d4f]",
                {
                  "!bg-passes-primary-color":
                    selectedMonth === i && selectedYear === currentYear
                }
              )}
              disabled={isDisabledBtn(i)}
              onClick={() => {
                onChangeMonth(i)
                onChangeYear(currentYear)
              }}
            >
              <span>{(i + 1).toString().padStart(2, "0")}</span>
            </button>
          ))}
      </div>
    </div>
  )
}
