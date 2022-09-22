import React, { useState } from "react"
import useMessages from "src/hooks/useMessages"

import { ChannelList, ChannelView } from "../molecules/messages"

const MessagesV2 = () => {
  const [selectedChannelId, setSelectedChannelId] = useState("")
  const { channels } = useMessages("test")

  const handleChannelClicked = (channelId: string) => {
    setSelectedChannelId(channelId)
  }

  return (
    <div className="flex h-full flex-row border border-gray-800">
      {channels?.length && (
        <ChannelList
          channels={channels}
          onChannelClicked={handleChannelClicked}
        />
      )}
      <ChannelView selectedChannelId={selectedChannelId} />
    </div>
  )
}

export default MessagesV2
