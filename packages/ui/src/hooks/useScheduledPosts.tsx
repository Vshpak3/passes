import { PostApi } from "@passes/api-client"
import { addSeconds } from "date-fns"
import { useEffect, useState } from "react"
import useSWR from "swr"

export type DateProps = {
  month: number
  year: number
}

export const CACHE_KEY_SCHEDULED_EVENTS = "/posts/scheduled"

export const useScheduledPosts = (defaultDate?: DateProps) => {
  const api = new PostApi()

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

  useEffect(() => {
    if (!hasInitialFetch && monthYear) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    hasInitialFetch,
    setMonthYear,
    deletePost
  }
}
