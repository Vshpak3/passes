import { ChannelMemberDto } from "@passes/api-client/models"
import React, { useState } from "react"
import { useMessages } from "src/hooks"

import { ChannelList, ChannelView } from "../molecules/messages"

const MessagesV2 = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const { channels, hasMore, next } = useMessages()
  const [gallery, setGallery] = useState(false)
  const handleChannelClicked = (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
  }

  return (
    <div className="flex h-full flex-row border border-gray-800">
      {channels?.length && (
        <ChannelList
          selectedChannel={selectedChannel}
          channels={channels}
          hasMore={hasMore}
          next={next}
          onChannelClicked={handleChannelClicked}
        />
      )}
      <ChannelView
        selectedChannel={selectedChannel}
        gallery={gallery}
        setGallery={setGallery}
      />
    </div>
  )
}

export default MessagesV2
