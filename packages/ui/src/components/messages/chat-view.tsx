import "stream-chat-react/dist/css/index.css"

import React, { useEffect, useRef, useState } from "react"
import { Channel as ChannelType, StreamChat } from "stream-chat"
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react"

import useChat from "../../hooks/useChat"
import useUser from "../../hooks/useUser"

type ChatViewProps = {
  username: string
}

const ChatView = ({ username }: ChatViewProps) => {
  const chatClient = StreamChat.getInstance("hx7kxuk3kyuf")
  const channel = useRef<ChannelType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { channelId, streamToken } = useChat(username)
  const { user } = useUser()

  useEffect(() => {
    if (!user?.id || !channelId || !streamToken) {
      return
    }

    const connect = async () => {
      await chatClient.connectUser(
        {
          id: user.id,
          name: user.userName,
          image: "https://www.moment.vip/moment.svg"
        },
        streamToken
      )

      channel.current = chatClient.channel("messaging", channelId)
      setIsLoading(false)
    }

    connect()
  }, [user, channelId, streamToken, chatClient])

  if (isLoading) {
    return null
  }

  return (
    <Chat client={chatClient} theme="messaging dark">
      {channel.current && (
        <Channel channel={channel.current}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      )}
    </Chat>
  )
}

export default ChatView
