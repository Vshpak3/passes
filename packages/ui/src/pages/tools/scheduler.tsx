import { useState } from "react"
import { Calendar } from "src/components/molecules/scheduler/Calendar"
import { EventTable } from "src/components/molecules/scheduler/EventTable"
import { SchedulerHeader } from "src/components/molecules/scheduler/SchedulerHeader"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const SchedulerPage = () => {
  const today = new Date()

  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear] = useState<number>(today.getFullYear())

  const handleChangeTime = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }

  return (
    <div className="bg-black">
      <SchedulerHeader onChangeTime={handleChangeTime} />
      <Calendar month={month} year={year} />
      <EventTable month={month} year={year} />
    </div>
  )
}

export default WithNormalPageLayout(SchedulerPage, { creatorOnly: true })
