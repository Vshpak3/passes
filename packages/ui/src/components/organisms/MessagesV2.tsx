// import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import React, { useState } from "react"
import { useMessages } from "src/hooks"

import { ChannelList, ChannelView } from "../molecules/messages"

const MessagesV2 = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const { channels, hasMore, next } = useMessages()
  const [gallery, setGallery] = useState(false)
  const freeMessages = 20
  const handleChannelClicked = (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
  }

  // const getFreeMessages = async () => {
  //   const freeMessagesResponse = await api.getFreeMessages({
  //     channelId: "testChannelId"
  //   })
  //   setFreeMessages(freeMessagesResponse)
  // }
  // TODO: use getFreeMessages endpoint when channels are setup

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
        freeMessages={freeMessages}
      />
    </div>
  )
}

export default MessagesV2
