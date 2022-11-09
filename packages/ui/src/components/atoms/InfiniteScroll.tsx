import classNames from "classnames"
import { debounce } from "lodash"
import ms from "ms"
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
  nextArg?: A
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
  KeyedComponent: ({ arg, index, nextArg }: ComponentArg<A>) => JSX.Element
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
  childrenEnd?: boolean
  renderDebounce?: number
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
const RENDER_DEBOUNCE = ms("2 seconds")
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
  pullDownToRefresh = false,
  node,
  children,
  keySelector,
  childrenEnd = false,
  renderDebounce = RENDER_DEBOUNCE
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

  const { data, setSize, mutate, size } = useSWRInfinite<T>(
    getKey,
    fetchData,
    newOptions
  )

  useEffect(() => {
    if (mutateOnLoad) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProps])

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

  const hasMore = useMemo(
    () => !data || !data.length || !!data[data.length - 1].lastId,
    [data]
  )

  const [isScrollable, setIsScrollable] = useState<boolean>(true)

  const checkScroll = useCallback(() => {
    const scrollable = node
      ? node.scrollHeight > node.clientHeight
      : (window.visualViewport?.height ?? 0) <
        (window.document?.body?.clientHeight ?? 1)
    setIsScrollable(scrollable)
    return scrollable
  }, [node, setIsScrollable])

  useLayoutEffect(() => {
    if (!isScrollable && hasMore) {
      const interval = setTimeout(() => {
        const scrollable = checkScroll()
        if (!scrollable) {
          triggerFetch()
        }
      }, renderDebounce)
      return () => clearInterval(interval)
    }
    return () => null
  }, [isScrollable, hasMore, triggerFetch, checkScroll, renderDebounce, node])

  useLayoutEffect(() => {
    checkScroll()
  }, [checkScroll, data, size])

  useLayoutEffect(() => {
    window.addEventListener("resize", checkScroll)

    return () => window.removeEventListener("resize", checkScroll)
  }, [checkScroll])

  return (
    <InfiniteScroll
      className={classNames(className)}
      dataLength={flattenedData.length}
      endMessage={flattenedData.length > 0 && endElement}
      hasMore={hasMore}
      initialScrollY={initialScrollY}
      inverse={inverse}
      loader={loadingElement}
      next={triggerFetch}
      pullDownToRefresh={pullDownToRefresh}
      scrollableTarget={scrollableTarget}
      style={style}
    >
      {!childrenEnd && children}
      {flattenedData.length === 0 && !hasInitialElement && emptyElement}
      {flattenedData.map((data, index) => (
        <KeyedComponent
          arg={data}
          index={index}
          key={keySelector ? (data[keySelector] as unknown as string) : index}
          nextArg={flattenedData[index + 1]}
        />
      ))}
      {childrenEnd && children}
    </InfiniteScroll>
  )
}
