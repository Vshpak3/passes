import React, { useState } from "react"
import { Loader } from "src/components/atoms/Loader"
import { Calendar } from "src/components/molecules/scheduler/Calendar"
import { EventTable } from "src/components/molecules/scheduler/EventTable"
import { SchedulerHeader } from "src/components/molecules/scheduler/SchedulerHeader"
import { useScheduledEvents } from "src/hooks/useScheduledEvents"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

export const SchedulerContext = React.createContext({
  month: 0,
  year: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setMonth: (_: number) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  setYear: (_: number) => {}
})

const SchedulerPage = () => {
  const today = new Date()
  const defaultDate = { month: today.getMonth(), year: today.getFullYear() }

  const [month, setMonth] = useState<number>(defaultDate.month)
  const [year, setYear] = useState<number>(defaultDate.year)

  const contextValue = { month, year, setMonth, setYear }

  const { data, hasInitialFetch } = useScheduledEvents(defaultDate)

  return (
    <SchedulerContext.Provider value={contextValue}>
      <div className="bg-black">
        <SchedulerHeader />
        {!hasInitialFetch && !data ? (
          <div className="pt-[100px]">
            <Loader />
          </div>
        ) : (
          <>
            <Calendar />
            <EventTable />
          </>
        )}
      </div>
    </SchedulerContext.Provider>
  )
}

export default WithNormalPageLayout(SchedulerPage, { creatorOnly: true })
