import {
  ChannelMemberDto,
  GetChannelsRequestDtoOrderTypeEnum,
  ListMemberDto
} from "@passes/api-client/models"
import React, { useState } from "react"
import { ChannelList, ChannelView } from "src/components/molecules/messages"
import { useMessages } from "src/hooks"

const MessagesV2 = () => {
  const [channelOrderType, setChannelOrderType] =
    useState<GetChannelsRequestDtoOrderTypeEnum>("recent")
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const { channels, hasMore, next, createChannel, refresh } = useMessages({
    channelOrderType
  })
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
  return (
    <div className="flex h-full flex-row border border-gray-800">
      <ChannelList
        channelOrderType={channelOrderType}
        setChannelOrderType={setChannelOrderType}
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
