import { FC, useEffect, useMemo, useState } from "react"

import { Select } from "src/components/atoms/input/Select"

interface DateSelectorProps {
  onDateChange: (d: Date) => void
}

export const DateSelector: FC<DateSelectorProps> = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date())

  const [year, setYear] = useState(date.getFullYear())
  const [month, setMonth] = useState(date.getMonth())
  const [day, setDay] = useState(date.getDate())

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
    return Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  }, [])

  useEffect(() => {
    const _date = new Date(year, month, day)
    setDate(_date)
    onDateChange(_date)
  }, [year, month, day, onDateChange])

  return (
    <div className="flex justify-between">
      <Select
        className="w-[140px]"
        defaultValue=""
        name="month"
        onChange={(m) => setMonth(selectMonths.indexOf(m))}
        selectOptions={selectMonths}
      />
      <Select
        className="w-[90px]"
        defaultValue=""
        name="day"
        onChange={setDay}
        selectOptions={selectDays}
      />
      <Select
        className="w-[100px]"
        defaultValue=""
        name="year"
        onChange={setYear}
        selectOptions={selectYears}
      />
    </div>
  )
}
