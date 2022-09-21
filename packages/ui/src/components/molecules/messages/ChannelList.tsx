import React from "react"

import { Channel } from "./ChannelListItem"
import { ChannelListItem } from "./index"

interface Props {
  channels: Array<Channel>
}

export const ChannelList = ({ channels }: Props) => {
  return (
    <div className="min-w-[20vw] border-r border-gray-800">
      {channels.map((channel, index) => (
        <ChannelListItem
          onClick={() => {
            console.log("channel clicked")
          }}
          channel={channel}
          key={index}
          isSelected={index === 0}
        />
      ))}
    </div>
  )
}
