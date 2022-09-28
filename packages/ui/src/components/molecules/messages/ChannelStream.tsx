import { MessageDto, MessagesApi } from "@passes/api-client"
import React, {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import { ChannelMessage } from "./index"

export interface ChannelStreamProps {
  channelId: string
}

export const ChannelStream = ({ channelId }: ChannelStreamProps) => {
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [earliestSentAt, setEarliestSentAt] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<MessageDto[]>([])

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    const element = e.currentTarget
    if (element.scrollTop <= 200) {
      console.log("REACHED TOP", channelId)
    }
  }

  const loadPreviousMessages = useCallback(async () => {
    const api = new MessagesApi()
    const res = await api.getMessages({
      getMessagesRequestDto: {
        sentAt: earliestSentAt,
        channelId,
        contentOnly: false,
        pending: true
      }
    })

    setEarliestSentAt(res.sentAt)
    setMessages((m) => [...res.messages, ...m])
  }, [channelId, earliestSentAt])

  useEffect(() => {
    if (isLoading) {
      return
    }

    const loadMessages = async () => {
      await loadPreviousMessages()
      bottomOfChatRef.current?.scrollIntoView({ behavior: "smooth" })
      setIsLoading(false)
    }

    loadMessages()
  }, [isLoading, loadPreviousMessages])

  return (
    <div
      className="flex h-full flex-1 flex-col overflow-y-scroll"
      onScroll={handleScroll}
      ref={bottomOfChatRef}
    >
      {messages.length ? (
        <>
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
          <ChannelMessage />
          <ChannelMessage />
          <ChannelMessage isOwnMessage />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          No messages
        </div>
      )}

      {/* Dummy ref to allow scrolling to bottom of chat */}
      <div ref={bottomOfChatRef} />
    </div>
  )
}
