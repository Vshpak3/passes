import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
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
  initialScrollY?: number
  mutateOnLoad?: boolean
  pullDownToRefresh?: boolean
  node?: HTMLDivElement
}

const defaultOptions: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateAll: false,
  revalidateFirstPage: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
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
  options = defaultOptions,
  initialScrollY,
  mutateOnLoad = true,
  pullDownToRefresh,
  node,
  children
}: PropsWithChildren<InfiniteScrollProps<A, T>>) => {
  options = { ...defaultOptions, ...options }
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

  const { data, size, setSize, mutate } = useSWRInfinite<T>(
    getKey,
    fetchData,
    options
  )

  useEffect(() => {
    if (mutateOnLoad) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerFetch = useCallback(
    debounce(async () => {
      setSize((size) => size + 1)
    }, SCROLL_DEBOUNCE_MS),
    [setSize]
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
  const hasMore = !data || !!data[data.length - 1].lastId

  const checkScroll = useCallback(() => {
    return node
      ? node.scrollHeight > node.clientHeight
      : window.visualViewport.height < window.document.body.clientHeight
  }, [node])

  const [isScrollable, setIsScrollable] = useState<boolean>(true)
  useEffect(() => {
    if (!isScrollable && hasMore) {
      triggerFetch()
      setIsScrollable(checkScroll)
    }
  }, [isScrollable, hasMore, flattenedData, triggerFetch, checkScroll])

  useLayoutEffect(() => {
    const handleWindowResize = () => {
      setIsScrollable(checkScroll)
    }
    setIsScrollable(checkScroll)

    window.addEventListener("resize", handleWindowResize)

    return () => window.removeEventListener("resize", handleWindowResize)
  }, [checkScroll])

  return (
    <InfiniteScroll
      className={classNames(className)}
      dataLength={flattenedData.length}
      endMessage={size !== 1 && endElement}
      hasMore={hasMore}
      initialScrollY={initialScrollY}
      inverse={inverse}
      loader={loadingElement}
      next={triggerFetch}
      pullDownToRefresh={pullDownToRefresh}
      scrollableTarget={scrollableTarget}
      style={style}
    >
      {children}
      {data?.length === 1 &&
        data[0].data.length === 0 &&
        !hasInitialElement &&
        emptyElement}
      {flattenedData.map((data, index) => (
        <KeyedComponent arg={data} index={index} key={index} />
      ))}
    </InfiniteScroll>
  )
}
