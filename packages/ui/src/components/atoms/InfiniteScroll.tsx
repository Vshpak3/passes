import classNames from "classnames"
import { debounce } from "lodash"
import React, {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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
  keySelector?: keyof A
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
  children,
  keySelector
}: PropsWithChildren<InfiniteScrollProps<A, T>>) => {
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

  const fetchData = async ({ props }: Key<T>) => {
    return await fetch(props as Omit<T, "data">)
  }

  const { data, setSize, mutate, isValidating } = useSWRInfinite<T>(
    getKey,
    fetchData,
    newOptions
  )

  useEffect(() => {
    if (mutateOnLoad) {
      mutate()
    }
  }, [fetchProps])

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
  const hasMore = useMemo(() => !data || !!data[data.length - 1].lastId, [data])

  const [isScrollable, setIsScrollable] = useState<boolean>(true)

  const checkScroll = useCallback(() => {
    setIsScrollable(
      node
        ? node.scrollHeight > node.clientHeight
        : (window.visualViewport?.height ?? 0) <
            (window.document?.body?.clientHeight ?? 1)
    )
  }, [node])

  useEffect(() => {
    if (!isScrollable && hasMore && !isValidating) {
      triggerFetch()
      checkScroll()
    }
  }, [isScrollable, hasMore, triggerFetch, checkScroll, isValidating])

  useLayoutEffect(() => {
    checkScroll()

    window.addEventListener("resize", checkScroll)

    return () => window.removeEventListener("resize", checkScroll)
  }, [checkScroll])

  return (
    <InfiniteScroll
      className={classNames(className)}
      dataLength={flattenedData.length}
      endMessage={flattenedData.length === 0 && endElement}
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
      {flattenedData.length === 0 && !hasInitialElement && emptyElement}
      {flattenedData.map((data, index) => (
        <KeyedComponent
          arg={data}
          index={index}
          key={keySelector ? (data[keySelector] as unknown as string) : index}
        />
      ))}
    </InfiniteScroll>
  )
}
