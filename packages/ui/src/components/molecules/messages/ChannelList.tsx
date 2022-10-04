import {
  ChannelMemberDto,
  GetChannelsRequestDtoOrderTypeEnum,
  ListMemberDto
} from "@passes/api-client/models"
import React from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import OrderDropDown from "src/components/molecules/OrderDropDown"

import { ChannelSearchInput } from "./ChannelSearchInput"
import { ChannelListItem } from "./index"

interface Props {
  channelOrderType: GetChannelsRequestDtoOrderTypeEnum
  setChannelOrderType: (order: GetChannelsRequestDtoOrderTypeEnum) => void
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  channels: Array<ChannelMemberDto>
  onChannelClicked: (channel: ChannelMemberDto) => void
  hasMore: boolean
  next: () => void
}

export const ChannelList = ({
  channelOrderType,
  setChannelOrderType,
  onUserSelect,
  selectedChannel,
  channels,
  onChannelClicked,
  hasMore,
  next
}: Props) => {
  const channelOrders = [
    { id: "recent", name: "Most recent" },
    { id: "tip", name: "Most tips" }
  ]
  return (
    <div className="min-w-[20vw] overflow-y-auto border-r border-[#fff]/10">
      <div className="px-[10px] py-[7px]">
        <div className="flex justify-between">
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
      )}
    </div>
  )
}
