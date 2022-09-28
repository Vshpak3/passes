import React, { useState } from "react"
import useMessages from "src/hooks/useMessages"

import { ChannelList, ChannelView } from "../molecules/messages"

const MessagesV2 = () => {
  const [selectedChannelId, setSelectedChannelId] = useState("")
  const { channels, hasMore, next } = useMessages()
  const [gallery, setGallery] = useState(false)
  const handleChannelClicked = (channelId: string) => {
    setSelectedChannelId(channelId)
  }

  return (
    <div className="flex h-full flex-row border border-gray-800">
      {channels?.length && (
        <ChannelList
          selectedChannelId={selectedChannelId}
          channels={channels}
          hasMore={hasMore}
          next={next}
          onChannelClicked={handleChannelClicked}
        />
      )}
      <ChannelView
        selectedChannelId={selectedChannelId}
        gallery={gallery}
        setGallery={setGallery}
      />
    </div>
  )
}

export default MessagesV2
