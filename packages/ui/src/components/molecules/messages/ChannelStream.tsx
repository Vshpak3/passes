import React from "react"

import { ChannelMessage } from "./index"

export const ChannelStream = () => {
  return (
    <div className="flex h-full flex-1 flex-col overflow-y-scroll">
      <ChannelMessage />
      <ChannelMessage isOwnMessage />
      <ChannelMessage />
      <ChannelMessage isOwnMessage />
      <ChannelMessage />
      <ChannelMessage />
      <ChannelMessage isOwnMessage />
      <ChannelMessage />
      <ChannelMessage />
      <ChannelMessage isOwnMessage />
    </div>
  )
}
