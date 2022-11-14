import { ScheduledEventDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { useScheduledEvent } from "src/hooks/entities/useScheduledEvent"
import { EventTableItem } from "./EventTableItem"

export interface EventTableItemCachedProps {
  scheduledEvent: ScheduledEventDto
  onDeleteEvent: (id: string) => void | Promise<void>
  onChangeTime: (id: string, time: Date) => void | Promise<void>
  isTablet: boolean
}

export const EventTableItemCached: FC<EventTableItemCachedProps> = ({
  scheduledEvent,
  ...res
}: EventTableItemCachedProps) => {
  const { scheduledEvent: cachedScheduledEvent, update } = useScheduledEvent(
    scheduledEvent.scheduledEventId
  )
  useEffect(() => {
    if (!cachedScheduledEvent) {
      update(scheduledEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledEvent, cachedScheduledEvent])

  return (
    <EventTableItem
      scheduledEvent={cachedScheduledEvent ?? scheduledEvent}
      {...res}
    />
  )
}
