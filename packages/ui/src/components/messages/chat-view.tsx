import "stream-chat-react/dist/css/index.css"

import { MessagesApi } from "@passes/api-client"
import React, { useEffect, useRef, useState } from "react"
import { useChat, useUser } from "src/hooks"
import { Channel as ChannelType, StreamChat } from "stream-chat"
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  MessageToSend,
  Thread,
  Window
} from "stream-chat-react"

import { wrapApi } from "../../helpers/wrapApi"
import { MomentMessage } from "./MomentMessage"
import { MomentMessageInput } from "./MomentMessageInput"

type ChatViewProps = {
  username: string
}

const ChatView = ({ username }: ChatViewProps) => {
  const chatClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_CHAT_KEY as string
  )
  const channel = useRef<ChannelType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tipAmount, setTipAmount] = useState(20)

  const { channelId, streamToken } = useChat(username)
  const { user } = useUser()

  const sendMessage = async (
    messageToSend: MessageToSend,
    channelId: string
  ) => {
    try {
      const api = wrapApi(MessagesApi)
      await api.messagesSend({
        messageDto: {
          text: messageToSend.text || "",
          attachments: [],
          channelId: channelId.split(":")[1],
          tipAmount: tipAmount
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const overrideSubmitHandler = async (
    message: MessageToSend,
    _cid: string
  ) => {
    try {
      await sendMessage(message, _cid)
    } catch (reason) {
      console.error(reason)
    }
  }

  useEffect(() => {
    if (!user?.id || !channelId || !streamToken) {
      return
    }

    const connect = async () => {
      await chatClient.connectUser(
        {
          id: user.id,
          name: user.username,
          image: "https://www.moment.vip/moment.svg"
        },
        streamToken
      )

      channel.current = chatClient.channel("messaging", channelId)
      setIsLoading(false)
    }

    connect()
  }, [user, channelId, streamToken, chatClient])

  if (isLoading || !user?.id || !channelId || !streamToken) {
    return null
  }

  const filters = { members: { $in: [user.id] } }
  return (
    <Chat client={chatClient} theme="messaging dark">
      <ChannelList filters={filters} />
      {channel.current && (
        <Channel channel={channel.current} Message={MomentMessage}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput
              overrideSubmitHandler={overrideSubmitHandler}
              Input={MomentMessageInput}
            />
            <input
              type="number"
              step="1"
              style={{ color: "black" }}
              value={tipAmount}
              onChange={(v) => setTipAmount(Number(v.target.value))}
            />
          </Window>
          <Thread />
        </Channel>
      )}
    </Chat>
  )
}

export default ChatView
