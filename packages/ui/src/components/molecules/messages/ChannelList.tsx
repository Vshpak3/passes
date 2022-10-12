import {
  ChannelMemberDto,
  GetChannelsRequestDtoOrderTypeEnum,
  ListMemberDto
} from "@passes/api-client/models"
import React, { FC } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { OrderDropDown } from "src/components/molecules/OrderDropDown"

import { ChannelListItem } from "./ChannelListItem"
import { ChannelSearchInput } from "./ChannelSearchInput"

interface ChannelListProps {
  channelOrderType: GetChannelsRequestDtoOrderTypeEnum
  setChannelOrderType: (order: GetChannelsRequestDtoOrderTypeEnum) => void
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  channels: Array<ChannelMemberDto>
  onChannelClicked: (channel: ChannelMemberDto) => void
  hasMore: boolean
  next: () => void
}

export const ChannelList: FC<ChannelListProps> = ({
  channelOrderType,
  setChannelOrderType,
  onUserSelect,
  selectedChannel,
  channels,
  onChannelClicked,
  hasMore,
  next
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
      {channels.length > 0 && (
        <div className="pt-6">
          <InfiniteScroll
            dataLength={channels.length}
            next={next}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>} // TODO: loader
          >
            {channels.map((channel, index) => (
              <ChannelListItem
                onClick={() => onChannelClicked(channel)}
                channel={channel}
                key={index}
                isSelected={selectedChannel?.channelId === channel.channelId}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}
