import { MessagesApi } from "@passes/api-client"
import { useMemo } from "react"

import { usePagination } from "./usePagination"

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
  const { data, hasMore, next } = usePagination(fetcher, {
    refreshInterval: 10000 // revalidate every 10 seconds
  })
  const channels = data ? data.map((d) => d.channelMembers).flat() : []
  return {
    createChannel,
    channels,
    hasMore,
    next
  }
}

export default useMessages
