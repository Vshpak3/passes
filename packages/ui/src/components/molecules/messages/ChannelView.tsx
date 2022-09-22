import React from "react"

import { ChannelStream, InputMessage } from "./index"

interface Props {
  selectedChannelId: string
}

export const ChannelView = ({ selectedChannelId }: Props) => {
  return (
    <div className="flex max-h-[90vh] flex-1 flex-col">
      Channel id: {selectedChannelId}
      <ChannelStream />
      <InputMessage />
    </div>
  )
}
