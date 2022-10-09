import { FC, PropsWithChildren, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

export interface FetchResultProps {
  lastId: string
  createdAt?: Date
  count: number
}

interface InfiniteScrollProps {
  fetch: (lastId?: string, createdAt?: Date) => Promise<FetchResultProps>
  initialFetch: FetchResultProps
  loader: JSX.Element
  endMessage: JSX.Element
}

// TODO: consider using useSWRInfinite
export const InfiniteScrollComponent: FC<
  PropsWithChildren<InfiniteScrollProps>
> = ({ children, fetch, initialFetch, loader, endMessage }) => {
  const [hasMore, setHasMore] = useState(!!initialFetch.createdAt)
  const [lastId, setLastId] = useState<string>(initialFetch.lastId)
  const [createdAt, setCreatedAt] = useState<Date | undefined>(
    initialFetch.createdAt
  )
  const [count, setCount] = useState<number>(initialFetch.count)

  const next = async () => {
    const {
      lastId: _lastId,
      createdAt: _createdAt,
      count: _count
    } = await fetch(lastId, createdAt)

    setLastId(_lastId)
    setCreatedAt(_createdAt)
    setCount(_count + count)
    setHasMore(!!_createdAt)
  }

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={count}
        className="w-full"
        style={{ width: "100%" }}
        next={next}
        hasMore={hasMore}
        loader={loader}
        endMessage={endMessage}
      >
        {children}
      </InfiniteScroll>
    </div>
  )
}
