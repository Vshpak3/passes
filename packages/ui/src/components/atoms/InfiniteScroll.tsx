import { debounce } from "lodash"
import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite"

const SCROLL_DEBOUNCE_MS = 450

export interface PagedData<A> {
  data: A[]
  lastId?: string
}

export interface ComponentArg<A> {
  arg: A
  index: number
}

export interface Key<T> {
  props: Partial<T>
  resets: number
  keyValue: string
}

interface InfiniteScrollProps<A, T extends PagedData<A>> {
  keyValue: string
  fetch: (data: Omit<T, "data">) => Promise<T>
  fetchProps: Partial<T>
  emptyElement?: JSX.Element | null
  loadingElement?: JSX.Element
  endElement?: JSX.Element
  KeyedComponent: ({ arg, index }: ComponentArg<A>) => JSX.Element
  resets?: number // increment to manually reset list
  className?: string
  options?: SWRInfiniteConfiguration
  style?: CSSProperties
  scrollableTarget?: string
  inverse?: boolean
  hasInitialElement?: boolean
}

// Note: there is no use of mutate as this could mess with the pagination
// Updates to subcomponents can be done within subcompoennts
// Deletes will hide the component
// Inserts should reset the list
//   unless inserts are at beginning, then just append
export const InfiniteScrollPagination = <A, T extends PagedData<A>>({
  keyValue,
  fetch,
  fetchProps,
  KeyedComponent,
  emptyElement,
  loadingElement,
  endElement,
  hasInitialElement = false,
  resets = 0,
  className,
  style = {},
  scrollableTarget,
  inverse = false,
  options = {
    revalidateOnMount: true,
    revalidateAll: false,
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  },
  children
}: PropsWithChildren<InfiniteScrollProps<A, T>>) => {
  const getKey = (pageIndex: number, response: T): Key<T> => {
    if (pageIndex === 0) {
      return { props: fetchProps, resets, keyValue }
    }
    const request: Partial<T> = { ...response }
    request.data = undefined
    return { props: request, resets, keyValue }
  }

  const fetchData = async ({ props }: Key<T>) => {
    return await fetch(props as Omit<T, "data">)
  }

  const { data, size, setSize } = useSWRInfinite<T>(getKey, fetchData, options)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerFetch = useCallback(
    debounce(async (_size: number) => {
      setSize(_size)
    }, SCROLL_DEBOUNCE_MS),
    []
  )

  const [flattenedData, setFlattenedData] = useState<A[]>([])

  useEffect(() => {
    setFlattenedData(
      data
        ?.map((d) => {
          return d.data
        })
        .flat() ?? []
    )
  }, [data])
  return (
    <InfiniteScroll
      dataLength={flattenedData.length}
      className={"w-full " + className ?? ""}
      style={{ width: "100%", ...style }}
      next={() => triggerFetch(size + 1)}
      hasMore={!data || !!data[data.length - 1].lastId}
      loader={loadingElement}
      endMessage={size !== 1 && endElement}
      scrollableTarget={scrollableTarget}
      inverse={inverse}
    >
      {children}
      {data?.length === 1 &&
        data[0].data.length === 0 &&
        !hasInitialElement &&
        emptyElement}
      {flattenedData.map((data, index) => (
        <KeyedComponent key={index} arg={data} index={index} />
      ))}
    </InfiniteScroll>
  )
}
