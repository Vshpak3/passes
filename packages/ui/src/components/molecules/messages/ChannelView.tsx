import React from "react"

import { ChannelStream, InputMessage } from "./index"

export const ChannelView = () => {
  return (
    <div className="flex max-h-[90vh] flex-1 flex-col">
      <ChannelStream />
      <InputMessage />
    </div>
  )
}
