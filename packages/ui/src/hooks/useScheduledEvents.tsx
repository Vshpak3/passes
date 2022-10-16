import { ScheduledApi } from "@passes/api-client"
import { addSeconds } from "date-fns"
import { useEffect, useState } from "react"
import useSWR from "swr"

export type DateProps = {
  month: number
  year: number
}

export const CACHE_KEY_SCHEDULED_EVENTS = "/scheduled"

export const useScheduledEvents = (defaultDate?: DateProps) => {
  const api = new ScheduledApi()

  const [monthYear, setMonthYear] = useState<DateProps | undefined>(defaultDate)

  // For a brief moment during rendering, data will be set undefined
  // before the loading begins. This boolean is needed to handle showing
  // the initial state properly before the loading begins.
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false)

  const {
    data,
    isValidating: loading,
    mutate
  } = useSWR(
    monthYear ? [CACHE_KEY_SCHEDULED_EVENTS, monthYear] : null,
    async () => {
      if (!monthYear) {
        return
      }
      setHasInitialFetch(true)
      return (
        await api.getScheduledEvents({
          getScheduledEventsRequestDto: {
            startDate: new Date(monthYear.year, monthYear.month, 1),
            endDate: addSeconds(
              new Date(monthYear.year, monthYear.month + 1, 1),
              -1000
            )
          }
        })
      ).data
    }
  )

  useEffect(() => {
    if (!hasInitialFetch && monthYear) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteScheduledEvent = async (scheduledEventId: string) => {
    await api.deleteScheduledEvent({
      deleteScheduledEventRequestDto: { scheduledEventId }
    })
    // TODO: don't mutate and instead mutate manually
    mutate()
  }

  const updateScheduledTime = async (
    scheduledEventId: string,
    scheduledAt: Date
  ) => {
    await api.updateScheduledEventTime({
      updateScheduledTimeRequestDto: { scheduledEventId, scheduledAt }
    })
    // TODO: don't mutate and instead mutate manually
    mutate()
  }

  return {
    data,
    loading,
    mutate,
    hasInitialFetch,
    setMonthYear,
    deleteScheduledEvent,
    updateScheduledTime
  }
}
