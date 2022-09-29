import { ChannelMemberDto, ListMemberDto } from "@passes/api-client/models"
import React from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import { ChannelSearchInput } from "./ChannelSearchInput"
import { ChannelListItem } from "./index"

interface Props {
  onUserSelect: (user: ListMemberDto) => void
  selectedChannel?: ChannelMemberDto
  channels: Array<ChannelMemberDto>
  onChannelClicked: (channel: ChannelMemberDto) => void
  hasMore: boolean
  next: () => void
}

export const ChannelList = ({
  onUserSelect,
  selectedChannel,
  channels,
  onChannelClicked,
  hasMore,
  next
}: Props) => {
  return (
    <div className="min-w-[20vw] border-r border-gray-800">
      <div className="px-[10px] py-[7px]">
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
