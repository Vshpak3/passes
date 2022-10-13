import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDtoOrderTypeEnum,
  GetChannelsResponseDto,
  ListMemberDto
} from "@passes/api-client/models"
import React, { FC } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { OrderDropDown } from "src/components/molecules/OrderDropDown"

import { ChannelListItem } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"

interface ChannelListProps {
  channelOrderType: GetChannelsRequestDtoOrderTypeEnum
  setChannelOrderType: (order: GetChannelsRequestDtoOrderTypeEnum) => void
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  onChannelClicked: (channel: ChannelMemberDto) => void
}

export const ChannelList: FC<ChannelListProps> = ({
  channelOrderType,
  setChannelOrderType,
  onUserSelect,
  selectedChannel,
  onChannelClicked
}) => {
  const channelOrders = [
    { id: "recent", name: "Most recent" },
    { id: "tip", name: "Highest Tip amount" },
    { id: "tip", name: "Highest All-Time Tip Amount" },
    { id: "tip", name: "Most Loyal" }
  ]
  return (
    <div className="min-w-[35%] overflow-y-auto border-r border-[#fff]/10 p-[30px] ">
      <div className="border-b border-[#fff]/10 pb-6">
        <div className="flex justify-between pb-6">
          <span className="text-base font-medium">Find people</span>
          <OrderDropDown
            orders={channelOrders}
            activeOrder={channelOrderType}
            setActiveOrder={setChannelOrderType as (order: string) => void}
          />
        </div>
        <ChannelSearchInput onUserSelect={onUserSelect} />
      </div>

      <div className="pt-6">
        <InfiniteScrollPagination<ChannelMemberDto, GetChannelsResponseDto>
          keyValue="/channels"
          fetch={({
            lastId,
            recent,
            tip
          }: {
            lastId?: string
            recent?: Date
            tip?: number
          } = {}) => {
            const api = new MessagesApi()
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
          }}
          fetchProps={{
            unreadOnly: false,
            order: "desc",
            orderType: channelOrderType,
            lastId: undefined,
            recent: undefined,
            tip: undefined
          }}
          KeyedComponent={({
            arg: channel
          }: ComponentArg<ChannelMemberDto>) => {
            return (
              <ChannelListItem
                onClick={() => onChannelClicked(channel)}
                channel={channel}
                isSelected={selectedChannel?.channelId === channel.channelId}
              />
            )
          }}
        />
      </div>
    </div>
  )
}
