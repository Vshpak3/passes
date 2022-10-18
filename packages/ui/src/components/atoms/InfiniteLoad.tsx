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
  loadMsg?: string
  loadMsgPosition?: LoadMsgPositionEnum
  numComments?: number
}

export enum LoadMsgPositionEnum {
  TOP = "top",
  BOTTOM = "bottom"
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
  loadMsg = "Load more",
  loadMsgPosition = LoadMsgPositionEnum.BOTTOM,
  numComments = 0,
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
  const [showedElementsCounter, setShowedElementsCounter] = useState<number>(0)
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

  const showedElementsHandler = () => {
    setShowedElementsCounter((prevState) => {
      if (data) {
        return prevState + data[data.length - 1].data.length
      }
      return prevState
    })
  }

  const triggerFetch = () => {
    setSize(size + 1)
    showedElementsHandler()
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
      setHasMore(!data || (!!data[data.length - 1].lastId && numComments > 5))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (isReverse) {
      setFlattenedData((prevState) => prevState.reverse())
    }
  }, [isReverse, data, hasMore])

  useEffect(() => {
    showedElementsHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <>
      {loadMsgPosition === LoadMsgPositionEnum.TOP &&
        hasMore &&
        showedElementsCounter < numComments && (
          <button onClick={triggerFetch}>{loadMsg}</button>
        )}
      {children}
      {flattenedData.map((data, index) => (
        <KeyedComponent key={index} arg={data} index={index} />
      ))}
      {loadMsgPosition === LoadMsgPositionEnum.BOTTOM && hasMore && (
        <button onClick={triggerFetch}>{loadMsg}</button>
      )}
      {!hasMore && !!flattenedData.length && endElement}
      {!hasMore && !flattenedData.length && emptyElement}
      {isValidating && loadingElement}
    </>
  )
}
