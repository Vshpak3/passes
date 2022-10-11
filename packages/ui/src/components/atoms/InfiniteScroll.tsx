import { debounce } from "lodash"
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useSWRInfinite from "swr/infinite"

const SCROLL_DEBOUNCE_MS = 500

export interface PagedData<A> {
  data: A[]
  lastId?: string
}

export interface ComponentArg<A> {
  arg: A
}

interface Key<T> {
  key: Partial<T>
  resets: number
}

interface InfiniteScrollProps<A, T extends PagedData<A>> {
  fetch: (data: Omit<T, "data">) => Promise<T>
  fetchProps: Partial<T>
  emptyElement?: JSX.Element
  loadingElement?: JSX.Element
  endElement?: JSX.Element
  KeyedComponent: ({ arg }: ComponentArg<A>) => JSX.Element
  resets?: number // increment to manually reset list
}

// Note: there is no use of mutate as this could mess with the pagination
// Updates to subcomponents can be done within subcompoennts
// Deletes will hide the component
// Inserts should reset the list
//   unless inserts are at beginning, then just append
export const InfiniteScrollPagination = <A, T extends PagedData<A>>({
  fetch,
  fetchProps,
  emptyElement,
  loadingElement,
  endElement,
  KeyedComponent,
  resets = 0,
  children
}: PropsWithChildren<InfiniteScrollProps<A, T>>) => {
  const getKey = (pageIndex: number, response: T): Key<T> => {
    if (pageIndex === 0) {
      return { key: fetchProps, resets }
    }
    const request: Partial<T> = { ...response }
    request.data = undefined
    return { key: request, resets: resets }
  }

  const fetchData = async ({ key }: Key<T>) => {
    return await fetch(key as Omit<T, "data">)
  }

  const { data, size, setSize } = useSWRInfinite<T>(getKey, fetchData, {
    revalidateOnMount: true,
    revalidateAll: false,
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  const triggerFetch = useMemo(
    () =>
      debounce(async (_size: number) => {
        setSize(_size)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <>
      <InfiniteScroll
        dataLength={flattenedData.length}
        className="w-full"
        style={{ width: "100%" }}
        next={() => triggerFetch(size + 1)}
        hasMore={!data || !!data[data.length - 1].lastId}
        loader={loadingElement}
        endMessage={size !== 1 && endElement}
      >
        {children}
        {data?.length === 1 && data[0].data.length === 0 && emptyElement}
        {flattenedData.map((data, index) => (
          <KeyedComponent key={index} arg={data} />
        ))}
      </InfiniteScroll>
    </>
  )
}
