import React from "react"

import { Channel } from "./ChannelListItem"
import { ChannelListItem } from "./index"

interface Props {
  channels: Array<Channel>
  onChannelClicked: (channelId: string) => void
}

export const ChannelList = ({ channels, onChannelClicked }: Props) => {
  return (
    <div className="min-w-[20vw] border-r border-gray-800">
      {channels.map((channel, index) => (
        <ChannelListItem
          onClick={() => {
            onChannelClicked(channel.channelId)
          }}
          channel={channel}
          key={index}
          isSelected={index === 0}
        />
      ))}
    </div>
  )
}
