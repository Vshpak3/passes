import { FeedApi } from "@passes/api-client"
import useSWRInfinite from "swr/infinite"

import { wrapApi } from "../helpers/wrapApi"
import useUser from "./useUser"

const withCursorPrefix = "/post?cursor="

const getKey = (_pageIndex: number, previousPageData: any) => {
  // Reached end, nothing to paginate
  if (previousPageData && !previousPageData.length) {
    return null
  }

  const cursor = previousPageData?.cursor ?? ""
  return cursor ? `${withCursorPrefix}${cursor}` : "/post"
}

const fetcher = async () => {
  const api = wrapApi(FeedApi)
  return await api.getFeed({ getFeedRequestDto: {} })
}

const useFeed = () => {
  const { accessToken } = useUser()
  const { data: posts, isValidating: isLoadingPosts } = useSWRInfinite(
    accessToken ? getKey : () => null,
    () => fetcher()
  )

  return { posts, isLoadingPosts }
}

export default useFeed
