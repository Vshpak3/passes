import { ScheduledEventDto } from "@passes/api-client"
import useSWR, { useSWRConfig } from "swr"

export const CACHE_KEY_SCHEDULED_EVENT = "/scheduled-event"

export const useScheduledEvent = (scheduledEventId: string) => {
  const { data: scheduledEvent } = useSWR<ScheduledEventDto>(
    scheduledEventId ? [CACHE_KEY_SCHEDULED_EVENT, scheduledEventId] : null
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: Partial<ScheduledEventDto>) =>
    _mutateManual([CACHE_KEY_SCHEDULED_EVENT, scheduledEventId], update, {
      populateCache: (
        update: Partial<ScheduledEventDto>,
        original: ScheduledEventDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  return {
    scheduledEvent,
    update: mutateManual
  }
}
