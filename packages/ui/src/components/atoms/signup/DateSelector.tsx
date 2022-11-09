import { getDaysInMonth } from "date-fns"
import { FC, useEffect, useMemo, useState } from "react"
import { FieldError } from "react-hook-form"

import { Select } from "src/components/atoms/input/Select"

interface DateSelectorProps {
  onDateChange: (d: Date) => void
  errors: FieldError | undefined
}

export const DateSelector: FC<DateSelectorProps> = ({
  onDateChange,
  errors
}) => {
  const [year, setYear] = useState<number>()
  const [month, setMonth] = useState<number>()
  const [day, setDay] = useState<number>()

  const selectYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())
  }, [])

  const selectMonths = useMemo(() => {
    if (day === 31) {
      return MONTHS.filter(
        (_label, month) => getDaysInMonth(new Date(2000, month)) === 31
      )
    }
    return MONTHS
  }, [day])

  const selectDays = useMemo(() => {
    return Array.from({ length: getDaysInMonth(month || 0) }, (_, i) =>
      (i + 1).toString()
    )
  }, [month])

  useEffect(() => {
    if (year !== undefined && month !== undefined && day !== undefined) {
      onDateChange(new Date(year, month, day))
    }
  }, [year, month, day, onDateChange])

  useEffect(() => {
    if (
      day === 31 &&
      month !== undefined &&
      getDaysInMonth(new Date(2000, month)) !== 31
    ) {
      setMonth(undefined)
    }
  }, [month, day, selectMonths])

  return (
    <>
      <div className="flex justify-between">
        <Select
          className="w-[140px]"
          name="month"
          onChange={(m) => setMonth(selectMonths.indexOf(m))}
          placeholder="Month"
          selectOptions={selectMonths}
        />
        <Select
          className="w-[90px]"
          name="day"
          onChange={(value) => setDay(Number(value))}
          placeholder="Day"
          selectOptions={selectDays}
        />
        <Select
          className="w-[100px]"
          name="year"
          onChange={setYear}
          placeholder="Year"
          selectOptions={selectYears}
        />
      </div>
      {errors && (
        <span className="mt-1 text-xs text-red-500">{errors?.message}</span>
      )}
    </>
  )
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
