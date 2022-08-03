import { FeedApi } from "@passes/api-client"
import useSWRInfinite from "swr/infinite"

import useUser from "./useUser"

const withCursorPrefix = "/post?cursor="

const getKey = (_pageIndex: number, previousPageData: any) => {
  // Reached end, nothing to paginate
  if (previousPageData && !previousPageData.length) {
    return null
  }

  const cursor = previousPageData?.cursor ?? ""
  return cursor ? `${withCursorPrefix}${cursor}` : `/post`
}

const fetcher = async (key: string, accessToken: string) => {
  const cursor = key.startsWith(withCursorPrefix)
    ? key.substring(withCursorPrefix.length)
    : ""

  const api = new FeedApi()
  return await api.feedGetFeed(
    { cursor },
    {
      headers: { Authorization: "Bearer " + accessToken }
    }
  )
}

const useFeed = () => {
  const { accessToken } = useUser()
  const { data: posts, isValidating: isLoadingPosts } = useSWRInfinite(
    accessToken ? getKey : () => null,
    (key) => fetcher(key, accessToken)
  )

  return { posts, isLoadingPosts }
}

export default useFeed
