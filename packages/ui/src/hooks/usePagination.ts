import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader
} from "swr/infinite"

interface FetcherProps {
  lastId?: string
}

// A function to get the SWR key of each page,
// its return value will be accepted by `fetcher`.
// If `null` is returned, the request of that page won't start.
const getKey: SWRInfiniteKeyLoader = (
  pageIndex: number,
  previousPageData: { lastId: string; [key: string]: any }
) => {
  // reached the end
  if (previousPageData && !previousPageData.lastId) return null

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return {}

  // pass the cursor to the fetcher function
  return { lastId: previousPageData.lastId }
}

export function usePagination<T>(
  fetcher: (props: FetcherProps) => Promise<T>,
  config?: SWRInfiniteConfiguration
) {
  const swr = useSWRInfinite(getKey, fetcher, config)

  // fetches next page
  const next = () => swr.setSize(swr.size + 1)
  // reloads all data
  const refresh = () => swr.setSize(1)
  // check if there's a next page
  const hasMore =
    swr.isValidating ||
    !!(swr.data && (swr.data[swr.data.length - 1] as any)?.lastId)

  return { ...swr, next, refresh, hasMore }
}
