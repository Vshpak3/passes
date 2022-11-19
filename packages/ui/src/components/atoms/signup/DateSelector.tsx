import { getDaysInMonth } from "date-fns"
import { FC, useEffect, useMemo, useState } from "react"
import { FieldError } from "react-hook-form"

import { NativeSelect } from "src/components/atoms/input/NativeSelect"

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
        <NativeSelect
          autoComplete="bday-month"
          className="w-[140px]"
          hasError={Boolean(errors)}
          name="month"
          onCustomChange={(m) => setMonth(selectMonths.indexOf(m))}
          placeholder="Month"
          selectOptions={selectMonths}
          transparent
        />
        <NativeSelect
          autoComplete="bday-day"
          className="w-[90px]"
          hasError={Boolean(errors)}
          name="day"
          onCustomChange={(value) => setDay(parseInt(value))}
          placeholder="Day"
          selectOptions={selectDays}
          transparent
        />
        <NativeSelect
          autoComplete="bday-year"
          className="w-[100px]"
          hasError={Boolean(errors)}
          name="year"
          onCustomChange={(value) => setYear(parseInt(value))}
          placeholder="Year"
          selectOptions={selectYears}
          transparent
        />
      </div>
      {Boolean(errors) && (
        <span className="mt-1 text-xs text-red-500">{errors?.message}</span>
      )}
    </>
  )
}
