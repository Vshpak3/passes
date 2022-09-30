import { MessagesApi } from "@passes/api-client"
import { useMemo } from "react"

import { usePagination } from "./usePagination"
import ms from "ms"

const useMessages = () => {
  const api = useMemo(() => new MessagesApi(), [])
  const fetcher = ({ lastId }: { lastId?: string } = {}) =>
    api.getChannels({
      getChannelsRequestDto: {
        unreadOnly: false,
        order: "desc",
        orderType: "recent",
        lastId
      }
    })

  const createChannel = (userId: string) => {
    return api.getOrCreateChannel({
      getChannelRequestDto: {
        userId
      }
    })
  }
  const { data, hasMore, next, refresh } = usePagination(fetcher, {
    refreshInterval: ms("10 seconds") // revalidate every 10 seconds
  })
  const channels = data ? data.map((d) => d.channelMembers).flat() : []
  return {
    createChannel,
    channels,
    hasMore,
    next,
    refresh
  }
}

export default useMessages
