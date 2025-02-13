import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react"
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite"

import { ComponentArg, Key, PagedData } from "./InfiniteScroll"

interface InfiniteLoadProps<A, T extends PagedData<A>> {
  keyValue: string
  fetch: (data: Omit<T, "data">) => Promise<T>
  fetchProps: Partial<T>
  KeyedComponent: ({ arg }: ComponentArg<A>) => JSX.Element

  emptyElement?: JSX.Element
  loadingElement?: JSX.Element
  endElement?: JSX.Element
  loadMoreMessage?: string
  loadMorePosition?: LoadMsgPositionEnum
  options?: SWRInfiniteConfiguration

  resets?: number // increment to manually reset list
}

export enum LoadMsgPositionEnum {
  TOP = "top",
  BOTTOM = "bottom"
}

const defaultOptions: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateAll: false,
  revalidateFirstPage: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  initialSize: 1
}

// Note: there is no use of mutate as this could mess with the pagination
// Updates to subcomponents can be done within subcompoennts
// Deletes will hide the component
// Inserts should reset the list
//   unless inserts are at beginning, then just append
export const InfiniteLoad = <A, T extends PagedData<A>>({
  keyValue,
  fetch,
  fetchProps,
  KeyedComponent,

  emptyElement,
  loadingElement,
  endElement,
  loadMoreMessage = "Load more",
  loadMorePosition = LoadMsgPositionEnum.BOTTOM,
  options = defaultOptions,
  resets = 0,
  children
}: PropsWithChildren<InfiniteLoadProps<A, T>>) => {
  const newOptions = useMemo(() => {
    return { ...defaultOptions, ...options }
  }, [options])
  const getKey = (pageIndex: number, response: T): Key<T> => {
    if (pageIndex === 0) {
      return { props: fetchProps, resets, keyValue }
    }
    const request: Partial<T> = { ...response }
    request.data = undefined
    return { props: request, resets, keyValue }
  }
  const [hasMore, setHasMore] = useState<boolean>(false)
  const fetchData = async ({ props }: Key<T>) => {
    return await fetch(props as Omit<T, "data">)
  }

  const { data, size, setSize, isValidating } = useSWRInfinite<T>(
    getKey,
    fetchData,
    newOptions
  )
  const triggerFetch = useCallback(() => {
    setSize((size) => size + 1)
  }, [setSize])
  const [flattenedData, setFlattenedData] = useState<A[]>([])

  useLayoutEffect(() => {
    if (data) {
      setFlattenedData(
        data
          ?.slice(0, data.length - 1)
          .map((d) => {
            return d.data
          })
          .flat() ?? []
      )
      setHasMore(!data || !!data[data.length - 1].lastId)
    }
  }, [data])

  useEffect(() => {
    if (!isValidating && size < 2) {
      triggerFetch()
    }
  }, [size, triggerFetch, isValidating])

  return (
    <>
      {loadMorePosition === LoadMsgPositionEnum.TOP && hasMore && (
        <button onClick={triggerFetch}>{loadMoreMessage}</button>
      )}
      {children}
      {flattenedData.map((data, index) => (
        <KeyedComponent arg={data} index={index} key={index} />
      ))}
      {loadMorePosition === LoadMsgPositionEnum.BOTTOM && hasMore && (
        <button onClick={triggerFetch}>{loadMoreMessage}</button>
      )}
      {!hasMore && !!flattenedData.length && endElement}
      {!hasMore && !flattenedData.length && emptyElement}
      {isValidating && loadingElement}
    </>
  )
}
