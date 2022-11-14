import {
  ScheduledApi,
  ScheduledEventDto,
  UpdateScheduledEventRequestDto
} from "@passes/api-client"
import { useSWRConfig } from "swr"

import { CACHE_KEY_SCHEDULED_EVENT } from "./entities/useScheduledEvent"

export const useUpdateScheduledEvent = () => {
  const api = new ScheduledApi()

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (
    scheduledEventId: string,
    update: Partial<ScheduledEventDto>
  ) =>
    _mutateManual([CACHE_KEY_SCHEDULED_EVENT, scheduledEventId], update, {
      populateCache: (
        update: Partial<ScheduledEventDto>,
        original: ScheduledEventDto | undefined
      ) => {
        return { ...original, ...update }
      },
      revalidate: false
    })

  const update = async (
    update: UpdateScheduledEventRequestDto & Partial<ScheduledEventDto>
  ) => {
    await api.updateScheduledEventBody({
      updateScheduledEventRequestDto: update
    })
    mutateManual(update.scheduledEventId, update)
  }

  return { update }
}
