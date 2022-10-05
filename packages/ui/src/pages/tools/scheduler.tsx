import { useCallback, useState } from "react"
import Calendar from "src/components/molecules/scheduler/Calendar"
import EventTable from "src/components/molecules/scheduler/EventTable"
import SchedulerHeader from "src/components/molecules/scheduler/SchedulerHeader"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

const today = new Date()

const SchedulerPage = () => {
  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear] = useState<number>(today.getFullYear())

  const handleChangeTime = useCallback((newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }, [])

  return (
    <CreatorOnlyWrapper isPage>
      <div className="bg-black">
        <SchedulerHeader
          onChangeTime={handleChangeTime}
          availableFrom={{ month: 6, year: 2021 }}
        />
        <Calendar month={month} year={year} />
        <EventTable />
      </div>
    </CreatorOnlyWrapper>
  )
}

export default withPageLayout(SchedulerPage)
