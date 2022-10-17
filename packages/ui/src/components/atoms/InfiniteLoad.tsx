import React, { PropsWithChildren, useEffect, useState } from "react"
import useSWRInfinite from "swr/infinite"

import { ComponentArg, Key, PagedData } from "./InfiniteScroll"

interface InfiniteLoadProps<A, T extends PagedData<A>> {
  keyValue: string
  fetch: (data: Omit<T, "data">) => Promise<T>
  fetchProps: Partial<T>
  emptyElement?: JSX.Element
  loadingElement?: JSX.Element
  endElement?: JSX.Element
  KeyedComponent: ({ arg }: ComponentArg<A>) => JSX.Element
  resets?: number // increment to manually reset list
  isReverse?: boolean
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
  emptyElement,
  loadingElement,
  endElement,
  KeyedComponent,
  resets = 0,
  isReverse,
  children
}: PropsWithChildren<InfiniteLoadProps<A, T>>) => {
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
    {
      revalidateOnMount: true,
      revalidateAll: false,
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  const triggerFetch = () => {
    setSize(size + 1)
  }
  const [flattenedData, setFlattenedData] = useState<A[]>([])

  useEffect(() => {
    if (data) {
      setFlattenedData(
        data
          ?.map((d) => {
            return d.data
          })
          .flat() ?? []
      )
      setHasMore(!data || !!data[data.length - 1].lastId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (isReverse) {
      setFlattenedData((prevState) => prevState.reverse())
    }
  }, [isReverse, data, hasMore])

  return (
    <>
      {children}
      {flattenedData.map((data, index) => (
        <KeyedComponent key={index} arg={data} />
      ))}
      {hasMore && <button onClick={triggerFetch}>Load more</button>}
      {!hasMore && !!flattenedData.length && endElement}
      {!hasMore && !flattenedData.length && emptyElement}
      {isValidating && loadingElement}
    </>
  )
}
