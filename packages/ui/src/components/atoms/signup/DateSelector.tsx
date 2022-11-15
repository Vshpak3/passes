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
    return [
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
  }, [])

  const selectDays = useMemo(() => {
    return Array.from(
      { length: getDaysInMonth(new Date(year || 2000, month || 0, 1)) },
      (_, i) => (i + 1).toString()
    )
  }, [month, year])

  useEffect(() => {
    if (year !== undefined && month !== undefined && day !== undefined) {
      onDateChange(new Date(year, month, day))
    }
  }, [year, month, day, onDateChange])

  return (
    <>
      <div className="flex w-full justify-between">
        <Select
          autoComplete="bday-month"
          className="w-[140px] bg-black"
          name="month"
          onChange={(m) => setMonth(selectMonths.indexOf(m))}
          placeholder="Month"
          selectOptions={selectMonths}
          transparent={false}
        />
        <Select
          autoComplete="bday-day"
          className="w-[90px] bg-black"
          name="day"
          onChange={setDay}
          placeholder="Day"
          selectOptions={selectDays}
          transparent={false}
        />
        <Select
          autoComplete="bday-year"
          className="w-[100px] bg-black"
          name="year"
          onChange={setYear}
          placeholder="Year"
          selectOptions={selectYears}
          transparent={false}
        />
      </div>
      {errors && (
        <span className="mt-1 text-xs text-red-500">{errors?.message}</span>
      )}
    </>
  )
}
