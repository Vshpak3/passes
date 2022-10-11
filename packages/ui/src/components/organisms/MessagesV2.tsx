import { MessagesApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  GetChannelsRequestDtoOrderTypeEnum,
  ListMemberDto
} from "@passes/api-client/models"
import React, { useEffect, useState } from "react"
import { ChannelList } from "src/components/molecules/messages/ChannelList"
import { ChannelView } from "src/components/molecules/messages/ChannelView"
import { useMessages } from "src/hooks/useMessages"
import { useUser } from "src/hooks/useUser"

export const MessagesV2 = () => {
  const [channelOrderType, setChannelOrderType] =
    useState<GetChannelsRequestDtoOrderTypeEnum>("recent")
  const [selectedChannel, setSelectedChannel] = useState<ChannelMemberDto>()
  const { channels, hasMore, next, createChannel, refresh } = useMessages({
    channelOrderType
  })
  const [gallery, setGallery] = useState(false)
  const [isCreator, setIsCreator] = useState(true)

  const { user } = useUser()
  const [freeMessages, setFreeMessages] = useState(20)
  const handleChannelClicked = async (channel: ChannelMemberDto) => {
    setSelectedChannel(channel)
  }

  const checkCreator = async () => {
    if (!user?.isCreator) {
      setIsCreator(false)
      await getFreeMessages()
    }
  }

  const onUserSelect = async (user: ListMemberDto) => {
    const channel = await createChannel(user.userId)
    await refresh()
    setSelectedChannel(channel)
  }

  const getFreeMessages = async () => {
    const api = new MessagesApi()
    if (!selectedChannel?.channelId) {
      return
    }
    const freeMessagesResponse = await api.getFreeMessages({
      channelId: selectedChannel.channelId
    })
    if (freeMessagesResponse) {
      setFreeMessages(freeMessagesResponse.messages)
    }
  }

  useEffect(() => {
    if (selectedChannel?.channelId) {
      checkCreator()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel])

  return (
    <div className="flex h-full flex-row border border-r-0 border-[#fff]/10">
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
        isCreator={isCreator}
        user={user}
      />
    </div>
  )
}
