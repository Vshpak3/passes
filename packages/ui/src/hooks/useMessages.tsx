import {
  GetChannelsRequestDtoOrderTypeEnum,
  MessagesApi
} from "@passes/api-client"
import ms from "ms"
import { useEffect, useMemo } from "react"

import { usePagination } from "./usePagination"

interface UseMessagesProps {
  channelOrderType: GetChannelsRequestDtoOrderTypeEnum
}
export const useMessages = ({ channelOrderType }: UseMessagesProps) => {
  const api = useMemo(() => new MessagesApi(), [])
  const fetcher = ({
    lastId,
    recent,
    tip
  }: {
    lastId?: string
    recent?: Date
    tip?: number
  } = {}) => {
    return api.getChannels({
      getChannelsRequestDto: {
        unreadOnly: false,
        order: "desc",
        orderType: channelOrderType,
        lastId,
        recent,
        tip
      }
    })
  }

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

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelOrderType])

  const channels = data ? data.map((d) => d.channelMembers).flat() : []
  return {
    createChannel,
    channels,
    hasMore,
    next,
    refresh
  }
}
