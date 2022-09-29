// import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto, ListMemberDto } from "@passes/api-client/models"
import React, { useState } from "react"
import { useMessages } from "src/hooks"

import { ChannelList, ChannelView } from "../molecules/messages"

const MessagesV2 = () => {
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const { channels, hasMore, next, createChannel, refresh } = useMessages()
  const [gallery, setGallery] = useState(false)
  const freeMessages = 20
  const handleChannelClicked = (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
  }

  const onUserSelect = async (user: ListMemberDto) => {
    const channel = await createChannel(user.userId)
    await refresh()
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
      <ChannelList
        onUserSelect={onUserSelect}
        selectedChannel={selectedChannel}
        channels={channels}
        hasMore={hasMore}
        next={next}
        onChannelClicked={handleChannelClicked}
      />
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
