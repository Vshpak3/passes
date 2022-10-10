import React, { PropsWithChildren, useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import useSWRInfinite from "swr/infinite"

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
  initProps: Partial<T>
  loader?: JSX.Element
  endMessage?: JSX.Element
  KeyedComponent: ({ arg }: ComponentArg<A>) => JSX.Element
  resets?: number // increment to manually reset list
}

// Note: there is no use of mutate as this could mess with the pagination
// Updates to subcomponents can be done within subcompoennts
// Deletes will hide the component
// Inserts should reset the list
//   unless inserts are at beginning, then just append
const InfiniteScrollPagination = <A, T extends PagedData<A>>({
  initProps,
  fetch,
  loader,
  endMessage,
  KeyedComponent,
  children,
  resets = 0
}: PropsWithChildren<InfiniteScrollProps<A, T>>) => {
  const getKey = (pageIndex: number, response: T): Key<T> => {
    if (pageIndex === 0) {
      return { key: initProps, resets }
    }
    const request: Partial<T> = { ...response }
    request.data = undefined
    return { key: request, resets: resets }
  }
  const fetcher = async ({ key }: Key<T>) => {
    return await fetch(key as Omit<T, "data">)
  }
  const { data, size, setSize } = useSWRInfinite<T>(getKey, fetcher, {
    revalidateOnMount: true
  })
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
    <>
      <InfiniteScroll
        dataLength={flattenedData.length}
        className="w-full"
        style={{ width: "100%" }}
        next={() => {
          setSize(size + 1)
        }}
        hasMore={!data || !!data[data.length - 1].lastId}
        loader={loader}
        endMessage={endMessage}
      >
        {children}
        {flattenedData.map((data, index) => (
          <KeyedComponent key={index} arg={data} />
        ))}
      </InfiniteScroll>
    </>
  )
}

export default InfiniteScrollPagination
