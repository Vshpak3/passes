import { PostApi } from "@passes/api-client"
import { addSeconds } from "date-fns"
import { useState } from "react"
import useSWR from "swr"

export type CalendarProps = {
  month: number
  year: number
}

export const CACHE_KEY_SCHEDULED_EVENTS = "/posts/scheduled"

export const useScheduledPosts = () => {
  const api = new PostApi()

  const [monthYear, setMonthYear] = useState<CalendarProps>()

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
      return (
        await api.getPostsScheduled({
          getPostsRangeRequestDto: {
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

  const deletePost = async (postId: string) => {
    await api.removePost({ postId })
    mutate()
  }

  // const { mutate: _mutateManual } = useSWRConfig()
  // const mutateManual = (update: Partial<ProfileUpdate>) =>
  //   _mutateManual(CACHE_KEY_SCHEDULED_EVENTS, update, {
  //     populateCache: (
  //       update: Partial<ProfileUpdate>,
  //       original: ProfileUpdate
  //     ) => {
  //       return Object.assign(original, update)
  //     },
  //     revalidate: false
  //   })

  return {
    data,
    loading,
    mutate,
    // mutateManual,
    setMonthYear,
    deletePost
  }
}
