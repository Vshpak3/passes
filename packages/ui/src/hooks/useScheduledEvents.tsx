import {
  CreatePostRequestDto,
  ScheduledApi,
  ScheduledEventDto,
  ScheduledEventDtoTypeEnum
} from "@passes/api-client"
import { addSeconds } from "date-fns"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

type DateProps = {
  month: number
  year: number
}

const CACHE_KEY_SCHEDULED_EVENTS = "/scheduled"

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

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: ScheduledEventDto[]) =>
    _mutateManual([CACHE_KEY_SCHEDULED_EVENTS, monthYear], update, {
      populateCache: (update: ScheduledEventDto[]) => {
        return update
      },
      revalidate: false
    })

  const deleteScheduledEvent = async (scheduledEventId: string) => {
    await api.deleteScheduledEvent({
      deleteScheduledEventRequestDto: { scheduledEventId }
    })
    if (!data) {
      return
    }
    mutateManual(data.filter((s) => s.scheduledEventId !== scheduledEventId))
  }

  const updateScheduledTime = async (
    scheduledEventId: string,
    scheduledAt: Date
  ) => {
    await api.updateScheduledEventTime({
      updateScheduledTimeRequestDto: { scheduledEventId, scheduledAt }
    })
    if (!data) {
      return
    }
    if (monthYear?.month === scheduledAt.getMonth()) {
      data[
        data.findIndex((s) => s.scheduledEventId === scheduledEventId)
      ].scheduledAt = scheduledAt
      data.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
      mutateManual(data)
    } else {
      // TODO: Currently each month change fetches. If we update this to cache
      // then this will have to mutual the month the scheduled post is moved to
      mutateManual(data.filter((s) => s.scheduledEventId !== scheduledEventId))
    }
  }

  const insertNewPost = async (post: CreatePostRequestDto) => {
    if (!data) {
      return
    }
    if (!post.scheduledAt) {
      return
    }
    setMonthYear({
      month: post.scheduledAt.getMonth(),
      year: post.scheduledAt.getFullYear()
    })
    const content: ScheduledEventDto = {
      scheduledEventId: "",
      scheduledAt: post.scheduledAt,
      createPost: post,
      type: ScheduledEventDtoTypeEnum.CreatePost,
      processed: false
    }
    data.push(content)
    data.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    mutateManual(data)
  }

  return {
    data,
    loading,
    mutate,
    hasInitialFetch,
    setMonthYear,
    deleteScheduledEvent,
    updateScheduledTime,
    insertNewPost
  }
}
