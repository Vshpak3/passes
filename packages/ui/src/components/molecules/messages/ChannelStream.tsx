import { MessageDto, MessagesApi } from "@passes/api-client"
import React, {
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"

import { ChannelMessage } from "./index"

const FETCH_NEW_MESSAGES_RATE = 3000 // 3 seconds

export interface ChannelStreamProps {
  channelId?: string
}

export const ChannelStream = ({ channelId }: ChannelStreamProps) => {
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [earliestSentAt, setEarliestSentAt] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(true)
  const [messages, setMessages] = useState<MessageDto[]>([])

  // Ref to keep latest message to fetch new ones, without causing refresh
  const latestMessageTimestamp = useRef<Date>(new Date())

  const handleScroll: UIEventHandler<HTMLDivElement> = async (e) => {
    const element = e.currentTarget
    if (element.scrollTop <= 200) {
      setIsLoadingOlderMessages(true)
      try {
        await loadPreviousMessages()
      } catch (e) {
        console.error("Error loading previous messages", e)
      } finally {
        setIsLoadingOlderMessages(false)
      }
    }
  }

  const loadPreviousMessages = useCallback(async () => {
    if (!channelId) {
      return
    }
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
    setMessages((m) => {
      const messages = [...res.messages, ...m]

      latestMessageTimestamp.current = messages.length
        ? messages[messages.length - 1].sentAt
        : new Date()

      return messages
    })
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

  useEffect(() => {
    if (!channelId) {
      return
    }

    const loadNewMessages = setTimeout(async () => {
      const api = new MessagesApi()
      const res = await api.getMessages({
        getMessagesRequestDto: {
          dateLimit: latestMessageTimestamp.current,
          channelId,
          contentOnly: false,
          pending: true
        }
      })

      const existingIds = new Set(messages.map((m) => m.messageId))
      const newMessages = [...messages]
      for (let i = 0; i < res.messages.length; ++i) {
        const message = res.messages[i]
        if (!existingIds.has(message.messageId)) {
          newMessages.push(message)
        }
      }

      setMessages(newMessages)
      latestMessageTimestamp.current =
        newMessages.length - 1
          ? newMessages[newMessages.length - 1].sentAt
          : new Date()
    }, FETCH_NEW_MESSAGES_RATE)

    return () => clearTimeout(loadNewMessages)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId])

  return (
    <div
      className="flex h-full flex-1 flex-col overflow-y-scroll"
      onScroll={handleScroll}
      ref={bottomOfChatRef}
    >
      {isLoadingOlderMessages && <div>Loading older messages...</div>}
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
